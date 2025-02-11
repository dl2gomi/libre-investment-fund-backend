const { fundContract: contract, httpProvider, wsProvider } = require('./blockchain/fundContract');
const { LastBlock } = require('./models');
const logger = require('./utils/logger');
const { listenContractEvents } = require('./blockchain/eventListener');
const { handleInvestment } = require('./blockchain/services/investmentService');
const { handleRedemption } = require('./blockchain/services/redemptionService');
const { handleMetricsUpdated } = require('./blockchain/services/metricsService');

async function fetchPastEvents() {
  try {
    const lastBlockInvestment = await LastBlock.findOne({ where: { eventName: 'Investment' } });
    const lastBlockRedemption = await LastBlock.findOne({ where: { eventName: 'Redemption' } });
    const lastBlockMetrics = await LastBlock.findOne({ where: { eventName: 'MetricsUpdated' } });

    logger.info(`Fetching events from the last recorded block`);

    // fetch events from the contract
    const pastEventsInvestment = await contract.queryFilter('Investment', lastBlockInvestment?.blockNumber ?? 0);
    const pastEventsRedemption = await contract.queryFilter('Redemption', lastBlockRedemption?.blockNumber ?? 0);
    const pastEventsMetrics = await contract.queryFilter('MetricsUpdated', lastBlockMetrics?.blockNumber ?? 0);

    // handle events using services
    for (const event of pastEventsInvestment) {
      await handleInvestment(
        event.args.investor,
        event.args.usdAmount,
        event.args.sharesIssued,
        event.args.sharePrice,
        event
      );
    }
    for (const event of pastEventsRedemption) {
      await handleRedemption(
        event.args.investor,
        event.args.shares,
        event.args.usdAmount,
        event.args.sharePrice,
        event
      );
    }
    for (const event of pastEventsMetrics) {
      await handleMetricsUpdated(event.args.totalAssetValue, event.args.sharesSupply, event.args.sharePrice, event);
    }

    // log
    logger.info('All the past events have been processed successfully.');
  } catch (error) {
    logger.error('Error fetching past events:', error);
  }
}

async function listenProviderEvents() {
  wsProvider.websocket.onerror = (error) => {
    logger.error('Provider error, attempting to reconnect...', error);
    startListener();
  };

  wsProvider.websocket.onclose = (event) => {
    logger.error(`Disconnected with event ${event}. Attempting to reconnect...`);
    startListener();
  };
}

// Start the event listeners
async function startListener() {
  console.log('Listening to events of the smart contract...');

  // remove all listeners
  contract.removeAllListeners();
  wsProvider.websocket.onerror = null;
  wsProvider.websocket.onclose = null;

  // Wait before connecting
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // handle past events
  await fetchPastEvents();

  // bind provider listeners
  await listenProviderEvents();

  // bind listeners
  await listenContractEvents();
}

startListener()
  .then(() => {
    logger.info('Listener started successfully');
  })
  .catch(async (error) => {
    logger.error('Error starting the listener', error);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    startListener();
  });
