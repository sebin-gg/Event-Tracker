const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry === "function") {
    void import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      })
      .catch((error) => {
        console.error('Unable to load web vitals:', error);
      });
  }
};

export default reportWebVitals;
