
myApp.controller("OldController", function ($scope) {
  $scope.msg = 'hi old';

  function lookupUrl(url){
    $scope.results = [];
    q = new Parse.Query(ParseGoLink);
    q.startsWith('url', url);
    q.find({
      success:function(golinks){
        noimage = _.filter(golinks, function(x){
          return x.get('image') == null;
        });
        _.each(noimage, function(golink){
          var base64 = $scope.image.split('base64,')[1];
          name = 'uploaded_img.jpg';
          var parseFile = new Parse.File(name, { base64: base64 });
          parseFile.save().then(function(){
            golink.set('image', parseFile);
            golink.save({
              success:function(data){
                lookupUrl($scope.url);
              }
            });
          });
        });

        $scope.results = golinks;
        $scope.$digest();
      }
    });
  }

  $scope.createGolink = function(){
    var base64 = $scope.image.split('base64,')[1];
    name = 'uploaded_img.jpg';
    var parseFile = new Parse.File(name, { base64: base64 });
    parseFile.save().then(function(){
      golink = new ParseGoLink();
      golink.set('member_email', 'davidbliu@gmail.com');
      golink.set('key', $scope.key);
      golink.set('url', $scope.url);
      golink.set('image', parseFile);
      golink.save({
        success:function(data){
          $scope.msg = 'saved';
          lookupUrl();
        }
      });
    });
  };

  $scope.setImage = function(golink){
    var base64 = $scope.image.split('base64,')[1];
    name = 'uploaded_img.jpg';
    var parseFile = new Parse.File(name, { base64: base64 });
    parseFile.save().then(function(){
      golink.set('image', parseFile);
      golink.save({
        success:function(data){
          lookupUrl($scope.url);
        }
      });
    });
  }

  function capture(){
    chrome.tabs.captureVisibleTab(null, {quality: 5}, function (image) {
      $scope.image = image;
    });
  }
  capture();

  chrome.tabs.getSelected(null, function(tab){
    if(tab.url.indexOf('docs.google.com')!= -1){
      separator = '/d/'
      splits = tab.url.split(separator);
      front = splits[0];
      end = splits[1].split('/')[0];
      $scope.url = front + separator + end;
    }
    else{
      $scope.url = tab.url;
    }
    lookupUrl($scope.url);
  });
    //chrome.tabs.captureVisibleTab(null, {quality: 5}, function (image) {
});
