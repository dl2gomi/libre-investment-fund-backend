const contract = require('./blockchain/fundContract');
const { LastBlock } = require('./models');
const logger = require('./utils/logger');
const { listenEvents } = require('./blockchain/eventListener');
const { handleInvestment } = require('./services/investmentService');
const { handleRedemption } = require('./services/redemptionService');
const { handleMetricsUpdated } = require('./services/metricsService');

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
  } catch (error) {
    logger.error('Error fetching past events:', error);
  }
}

// Start the event listeners
async function startListener() {
  // handle past events
  await fetchPastEvents();

  // bind listeners
  await listenEvents();
}

console.log('Listening to events of the smart contract...');
startListener()
  .then(() => {
    logger.info('Listener started successfully');
  })
  .catch((error) => {
    logger.error('Error starting the listener', error);
  });
