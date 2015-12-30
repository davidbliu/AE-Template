var VisualGolinkFields = ['key', 'image', 'url'];

myApp.controller("HomeController", function ($scope) {
  $scope.msg = 'hello';
  function capture(){
    chrome.tabs.captureVisibleTab(null, {quality: 5}, function (image) {
       // You can add that image HTML5 canvas, or Element.
      console.log(image);
      $scope.image = image;
      $('#capture-img').attr('src', image);
        //var canvas = document.getElementById('myCanvas');
        //var context = canvas.getContext('2d');

        //// load image from data url
        //var imageObj = new Image();
        //imageObj.onload = function() {
          //console.log('this stuff');
          //console.log(this.width);
          //width = 750;
          //height = this.height * 750/this.width;
          //context.drawImage(this, 0, 0, width, height);
        //};
        //imageObj.src = image;
    });
  }
  capture();

  function pullLinks(){
    $scope.golinks = [];
    q = new Parse.Query(VisualGolink);
    q.descending('createdAt');
    q.find({
      success:function(golinks){
        $scope.golinks = convertParseObjects(golinks, VisualGolinkFields);
        $scope.$digest();
      }
    });
  }
  pullLinks();

  $scope.capture = function(){
    //var canvas = document.getElementById('myCanvas');
    //dataUrl = canvas.toDataURL();
    var base64 = $scope.image.split('base64,')[1];
    //var base64 = dataUrl.split('base64,')[1];
    name = 'davidtest.jpg';
    var parseFile = new Parse.File(name, { base64: base64 });
    parseFile.save().then(function(){
      chrome.tabs.getSelected(null,function(tab) {
        var visualLink = new VisualGolink();
        visualLink.set('image', parseFile);
        visualLink.set('url', tab.url);
        visualLink.set('key', $scope.key);
        visualLink.save(null, {
          success:function(data){
            pullLinks();
          }
        });
      });
    });
  }

});
