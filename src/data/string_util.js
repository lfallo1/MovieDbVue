export default{
  formatTwoDecimals: function(val){
    return val < 10 ? '0' + val : val;
  },
  toCurrency: function(val){
    if(isNaN(val)){
      return '$0.00';
    }
    var currencyString = '';
    var chars = val.toString().split('');
    for(var i = chars.length - 1; i >= 0; i--){
      if(currencyString.length > 2 && (currencyString.replace(/[^0-9]/g,'').length % 3 == 0)){
        currencyString = ',' + currencyString;
      }
      currencyString = chars[i] + currencyString;
    }
    return '$' + currencyString + '.00';
  },
  dateToString: function(val){
    if(!val || !val.getFullYear){
      return new Date().getFullYear() + '-01-01';
    }
    return val.getFullYear() + '-' + this.formatTwoDecimals(val.getMonth() + 1) + '-' + this.formatTwoDecimals(val.getDate());
  }
}
