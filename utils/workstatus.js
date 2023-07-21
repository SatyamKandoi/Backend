const getLabelForValue = (value) => {
    switch (value) {
        case 1:
          return 'WFO';
        case 2:
          return 'WFH';
        case 3:
          return 'Full Leave';
        case 4:
          return 'Half Leave';
        default:
          return 'Unknown';
      }
  };
  
module.exports = {
    getLabelForValue
  };