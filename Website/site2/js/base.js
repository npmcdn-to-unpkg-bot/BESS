$(document).ready(function() {
  //Jquery code here
  console.log("jquery wordt geladen");

  Morris.Bar({
  element: 'bar-results',
  data: [
    { y: '1', ja: 100, nee: 90, a:0 , b:0, c:0 },
    { y: '2', ja: 80, nee: 30, a:40 , b:60, c:2 },
    { y: '3', ja: 40, nee: 90, a:46 , b:30, c:19 },
    { y: '4', ja: 10, nee: 39, a:29 , b:65, c:84 },
    { y: '5', ja: 60, nee: 82, a:32 , b:34, c:55 },
    { y: '6', ja: 100, nee: 90, a:0 , b:0, c:0 },
    { y: '7', ja: 80, nee: 30, a:40 , b:60, c:2 },
    { y: '8', ja: 40, nee: 90, a:46 , b:30, c:19 },
    { y: '9', ja: 10, nee: 39, a:29 , b:65, c:84 },
    { y: '10', ja: 60, nee: 82, a:32 , b:34, c:55 }
  ],
  xkey: 'y',
  ykeys: ['ja', 'nee','a', 'b', 'c'],
  labels: ['Series JA', 'Series NEE', 'Series A', 'Series B', 'Series C']
});
});
