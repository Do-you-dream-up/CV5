import contextPush from './contextPushExt';

export const ExternalInfoProcessor = [
  function globalInfoProcessor(externalInfos) {
    externalInfos.windowLocation = window.location.href;
    externalInfos.language = navigator.language;
    externalInfos.referrer = document.referrer;
    externalInfos.usedKeywords = contextPush.processKeywords(document.referrer);
    externalInfos.now = new Date().getTime();
  },
  function visitCountProcessor(externalInfos, now) {
    now = now || externalInfos.now;
    let visitCount = contextPush.getGlobalVisitCount();
    const lastPageLoadedTime = contextPush.getLastPageLoadedTime();
    let isNewVisit = false;
    const elapsedTime = now - lastPageLoadedTime;
    if (elapsedTime > 30 * 60 * 1000) {
      isNewVisit = true;
    }
    if (isNewVisit) {
      visitCount++;
      contextPush.resetSessionCount(now);
      contextPush.setGlobalVisitCount(visitCount);
    }
    contextPush.setLastPageLoadedTime(now);
    externalInfos.visitCount = visitCount;
  },

  function visitDurationProcessor(externalInfos, now) {
    now = now || externalInfos.now;
    externalInfos.visitDuration = contextPush.getGlobalVisitDuration(now);
  },

  function pagesViewedCountCountProcessor(externalInfos) {
    externalInfos.pagesViewedCount = contextPush.getPagesViewedCount();
  },

  function durationSinceLastVisitCountProcessor(externalInfos) {
    externalInfos.durationSinceLastVisit =
      contextPush.getDurationSinceLastVisit();
  },
];
