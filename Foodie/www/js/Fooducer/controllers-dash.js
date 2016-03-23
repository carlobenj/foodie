angular.module('foodie.controllers.dash', ['foodie.services', 'foodie.plugins'])

.controller('FooducerDashCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, Dashboard) {
  
  $scope.total_views = 0;
  $scope.average_views = 0;
  
  $scope.getMyDashboard = function(){
    Dashboard.getMyDashboard({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.dashboard = successData.result;
            $scope.active_bar_released = ((successData.result.fooducer_active_voucher_released / successData.result.fooducer_active_voucher_released) * 100 || 0).toFixed(2); 
            $scope.active_bar_bought = ((successData.result.fooducer_active_voucher_bought / successData.result.fooducer_active_voucher_released) * 100 || 0).toFixed(2);            
            $scope.active_bar_claimed = ((successData.result.fooducer_active_voucher_claimed / successData.result.fooducer_active_voucher_released) * 100 || 0).toFixed(2);            
            
            $scope.total_bar_claimed = ((successData.result.fooducer_total_voucher_claimed / successData.result.fooducer_total_voucher_bought) * 100 || 0).toFixed(2);
            $scope.buildLineChart($scope.dashboard.view_data); 
            $scope.buildPieChart(Math.round(successData.result.fooducer_total_voucher_claimed),Math.round(successData.result.fooducer_total_voucher_bought - successData.result.fooducer_total_voucher_claimed));
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){

      });
  }

  $scope.isHalf = function(value){
    if(parseInt(value) <= 45){
      return true;
    }
    else{
      return false;
    }
  }

  $scope.goTo = function(value){
    $location.path('/fooducer/dash/' + value).replace();
  }

//=-=-=-=-=-=-=-=-ONLOAD=-=-=-=--=-=--=-

  $scope.getMyDashboard()


/*======================== CHARTING TRIAL ===========================*/

$scope.buildLineChart = function(data){
    var allDates = [];
    var allCount = [];
    for(x = 0; x <= 6; x++)
    {
        if(x < 6){
            allDates.push(moment(data[x].pointDate,'YYYY-MM-DD HH:mm:ss').format('MMM D'));
        }
        else
        {
            allDates.push("Today");
        }
        allCount.push(data[x].allFoodicts.length);
        $scope.total_views += data[x].allFoodicts.length;
    }
    $scope.average_views = ($scope.total_views/7).toFixed(2);
    var ctx = document.getElementById("viewsLineChart").getContext("2d");
    var data = {
        labels: allDates,
        datasets: [
            {
                // rgb 236,48,92
                label: "My Second dataset",
                fillColor: "rgba(255,255,255,0.2)",
                strokeColor: "rgba(255,255,255,1)",
                pointColor: "rgba(255,255,255,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#E01242",
                pointHighlightStroke: "rgba(255,255,255,1)",
                data: allCount
            }
        ]
    };
    var options = {
        animation: false, // Boolean - Whether to animate the chart   
        animationSteps: 60,  // Number - Number of animation steps    
        animationEasing: "easeOutQuart", // String - Animation easing effect  
        showScale: true,    
        scaleOverride: false, // Boolean - If we want to override with a hard coded scale
        // ** Required if scaleOverride is true **    
        scaleSteps: null, // Number - The number of steps in a hard coded scale    
        scaleStepWidth: null, // Number - The value jump in the hard coded scale    
        scaleStartValue: null, // Number - The scale starting value    
        scaleLineColor: "rgba(255,255,255,.1)", // String - Colour of the scale line    
        scaleLineWidth: 1, // Number - Pixel width of the scale line    
        scaleShowLabels: true, // Boolean - Whether to show labels on the scale    
        scaleLabel: "<%=value%>", // Interpolated JS string - can access value    
        scaleIntegersOnly: true, // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there    
        scaleBeginAtZero: false, // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value    
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Scale label font declaration for the scale label    
        scaleFontSize: 12, // Number - Scale label font size in pixels    
        scaleFontStyle: "normal", // String - Scale label font weight style   
        scaleFontColor: "#FFF",  // String - Scale label font colour    
        responsive: true, // Boolean - whether or not the chart should be responsive and resize when the browser does.    
        maintainAspectRatio: true, // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container    
        showTooltips: true, // Boolean - Determines whether to draw tooltips on the canvas or not
        customTooltips: false, // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
        tooltipEvents: ["mousemove", "touchstart", "touchmove"], // Array - Array of string names to attach tooltip events        
        tooltipFillColor: "rgba(255,255,255,0.8)", // String - Tooltip background colour    
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Tooltip label font declaration for the scale label    
        tooltipFontSize: 14, // Number - Tooltip label font size in pixels    
        tooltipFontStyle: "normal", // String - Tooltip font weight style    
        tooltipFontColor: "#E01242", // String - Tooltip label font colour    
        tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Tooltip title font declaration for the scale label    
        tooltipTitleFontSize: 14, // Number - Tooltip title font size in pixels    
        tooltipTitleFontStyle: "bold", // String - Tooltip title font weight style    
        tooltipTitleFontColor: "#E01242", // String - Tooltip title font colour    
        tooltipYPadding: 6,// Number - pixel width of padding around tooltip text    
        tooltipXPadding: 6, // Number - pixel width of padding around tooltip text    
        tooltipCaretSize: 8, // Number - Size of the caret on the tooltip    
        tooltipCornerRadius: 6, // Number - Pixel radius of the tooltip border    
        tooltipXOffset: 10, // Number - Pixel offset from point x to tooltip edge    
        tooltipTemplate: "<%if (label){%><%}%><%= value%> view(s)", // String - Template string for single tooltips 
        multiTooltipTemplate: "<%= value %>", // String - Template string for single tooltips
        scaleShowGridLines : true, ///Boolean - Whether grid lines are shown across the chart    
        scaleGridLineColor : "rgba(255,255,255,.1)", //String - Colour of the grid lines    
        scaleGridLineWidth : 1, //Number - Width of the grid lines    
        scaleShowHorizontalLines: true, //Boolean - Whether to show horizontal lines (except X axis)   
        scaleShowVerticalLines: true,  //Boolean - Whether to show vertical lines (except Y axis)   
        bezierCurve : false,  //Boolean - Whether the line is curved between points    
        bezierCurveTension : 0.4, //Number - Tension of the bezier curve between points    
        pointDot : true, //Boolean - Whether to show a dot for each point    
        pointDotRadius : 3, //Number - Radius of each point dot in pixels    
        pointDotStrokeWidth : 2, //Number - Pixel width of point dot stroke    
        pointHitDetectionRadius : 20, //Number - amount extra to add to the radius to cater for hit detection outside the drawn point    
        datasetStroke : true, //Boolean - Whether to show a stroke for datasets    
        datasetStrokeWidth : 2, //Number - Pixel width of dataset stroke    
        datasetFill : true, //Boolean - Whether to fill the dataset with a colour    
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>", //String - A legend template
        onAnimationProgress: function(){},// Function - Will fire on animation progression.
        onAnimationComplete: function(){}  // Function - Will fire on animation completion.
    };
    Chart.defaults.global.responsive = true;
    var viewLineChart = new Chart(ctx).Line(data, options);
}


$scope.buildPieChart = function(data1,data2){
    var voucherPieChart = document.getElementById("voucherPieChart").getContext("2d");
    var pieData = [        
        {
            value: data1,
            color: "rgba(255,255,255, 0.75)",
            highlight: "#FFFFFF",
            label: "Claimed"
        },
        {
            value: data2,
            color:"rgba(255,255,255, 0.2)",
            highlight: "#FFFFFF",
            label: "Unclaimed"
        }
    ]

    var pieOptions = {
        animation: false,
        tooltipFillColor: "rgba(0,0,0,0.5)",

    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke : false,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 0, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : false,

    //String - A legend template
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

}

    var totalVoucherPieChart = new Chart(voucherPieChart).Pie(pieData,pieOptions);
}

    

  


        // {
        //     label: "My First dataset",
        //     fillColor: "rgba(180,180,180,0.2)",
        //     strokeColor: "rgba(180,180,180,1)",
        //     pointColor: "rgba(180,180,180,1)",
        //     pointStrokeColor: "#fff",
        //     pointHighlightFill: "#fff",
        //     pointHighlightStroke: "rgba(180,180,180,1)",
        //     data: [65, 59, 80, 81, 56, 55, 40]
        // }

  



})

.controller('FooducerArchivesCtrl', function($scope, $location, $foodieUtils, $ionicLoading, Token, Archive) {
  
  $scope.getMyArchives = function(){
    Archive.getMyArchives({api_key: Token.api_key, fooducer_ID: Token.fooducer_ID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.archives = successData.result;
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
        $foodieUtils.errorCatcher(error.status);
      });
  }

  $scope.goTo = function(value){
    $location.path('/fooducer/dash/archives/' + value).replace();
  }

  /*========================== ONLOAD ==========================*/
  $scope.getMyArchives();
})



.controller('FooducerArchiveDetailsCtrl', function($scope, $location, $foodieUtils, $stateParams, $ionicLoading, Token, Archive) {
  
  $scope.getArchiveDetails = function(){
    Archive.getArchiveDetails(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_ID: $stateParams.offerID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.archive = successData.result;
             $scope.buildLineChart(successData.result.claim_bought_track);
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
        $foodieUtils.errorCatcher(error.status);
      });
  }


  $scope.openCouponDetails = function(offer_ID){
    $location.path('/fooducer/dash/archives/promo/details/' + offer_ID).replace();
  }

    $scope.buildLineChart = function(data){

        var allDates = [];
        var allBought = [];
        var allClaim = [];
        for(x = 0; x < data.length; x++)
        {            
            // if(x < 6){
            //     allDates.push(moment(data[x].pointDate,'YYYY-MM-DD HH:mm:ss').format('MMM D'));
            // }
            // else
            // {
            //     allDates.push("Today");
            // }
            allDates.push(moment(data[x].pointDate,'YYYY-MM-DD HH:mm:ss').format('MMM D'));
            allBought.push(data[x].boughtCount);
            allClaim.push(data[x].claimCount);
        }
        var claimBoughtChart = document.getElementById("claimBoughtAreaChart").getContext("2d");
        var data = {
            labels: allDates,
            datasets: [
                {
                    // rgb 236,48,92
                    label: "Claimed",
                    fillColor: "rgba(255, 217, 107, 0.75)",
                    strokeColor: "rgb(255, 217, 107)",
                    pointColor: "rgb(255, 217, 107)",
                    pointStrokeColor: "rgb(255, 217, 107)",
                    pointHighlightFill: "#E01242",
                    pointHighlightStroke: "rgb(255, 217, 107)",
                    data: allClaim
                },
                {
                    // rgb 236,48,92
                    label: "Bought",
                    fillColor: "rgba(255,255,255,0.2)",
                    strokeColor: "rgba(255,255,255,1)",
                    pointColor: "rgba(255,255,255,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#E01242",
                    pointHighlightStroke: "rgba(255,255,255,1)",
                    data: allBought
                }
            ]
        };
        var options = {
            animation: false, // Boolean - Whether to animate the chart   
            animationSteps: 60,  // Number - Number of animation steps    
            animationEasing: "easeOutQuart", // String - Animation easing effect  
            showScale: true,    
            scaleOverride: false, // Boolean - If we want to override with a hard coded scale
            // ** Required if scaleOverride is true **    
            scaleSteps: null, // Number - The number of steps in a hard coded scale    
            scaleStepWidth: null, // Number - The value jump in the hard coded scale    
            scaleStartValue: null, // Number - The scale starting value    
            scaleLineColor: "rgba(255,255,255,.1)", // String - Colour of the scale line    
            scaleLineWidth: 1, // Number - Pixel width of the scale line    
            scaleShowLabels: true, // Boolean - Whether to show labels on the scale    
            scaleLabel: "<%=value%>", // Interpolated JS string - can access value    
            scaleIntegersOnly: true, // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there    
            scaleBeginAtZero: false, // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value    
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Scale label font declaration for the scale label    
            scaleFontSize: 12, // Number - Scale label font size in pixels    
            scaleFontStyle: "normal", // String - Scale label font weight style   
            scaleFontColor: "#FFF",  // String - Scale label font colour    
            responsive: true, // Boolean - whether or not the chart should be responsive and resize when the browser does.    
            maintainAspectRatio: true, // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container    
            showTooltips: true, // Boolean - Determines whether to draw tooltips on the canvas or not
            customTooltips: false, // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
            tooltipEvents: ["mousemove", "touchstart", "touchmove"], // Array - Array of string names to attach tooltip events        
            tooltipFillColor: "rgba(255,255,255,0.8)", // String - Tooltip background colour    
            tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Tooltip label font declaration for the scale label    
            tooltipFontSize: 14, // Number - Tooltip label font size in pixels    
            tooltipFontStyle: "normal", // String - Tooltip font weight style    
            tooltipFontColor: "#E01242", // String - Tooltip label font colour    
            tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", // String - Tooltip title font declaration for the scale label    
            tooltipTitleFontSize: 14, // Number - Tooltip title font size in pixels    
            tooltipTitleFontStyle: "bold", // String - Tooltip title font weight style    
            tooltipTitleFontColor: "#E01242", // String - Tooltip title font colour    
            tooltipYPadding: 6,// Number - pixel width of padding around tooltip text    
            tooltipXPadding: 6, // Number - pixel width of padding around tooltip text    
            tooltipCaretSize: 8, // Number - Size of the caret on the tooltip    
            tooltipCornerRadius: 6, // Number - Pixel radius of the tooltip border    
            tooltipXOffset: 10, // Number - Pixel offset from point x to tooltip edge    
            tooltipTemplate: "<%if (label){%><%}%><%= value%> view(s)", // String - Template string for single tooltips 
            multiTooltipTemplate: "<%= value %>", // String - Template string for single tooltips
            scaleShowGridLines : true, ///Boolean - Whether grid lines are shown across the chart    
            scaleGridLineColor : "rgba(255,255,255,.1)", //String - Colour of the grid lines    
            scaleGridLineWidth : 1, //Number - Width of the grid lines    
            scaleShowHorizontalLines: true, //Boolean - Whether to show horizontal lines (except X axis)   
            scaleShowVerticalLines: true,  //Boolean - Whether to show vertical lines (except Y axis)   
            bezierCurve : false,  //Boolean - Whether the line is curved between points    
            bezierCurveTension : 0.4, //Number - Tension of the bezier curve between points    
            pointDot : true, //Boolean - Whether to show a dot for each point    
            pointDotRadius : 3, //Number - Radius of each point dot in pixels    
            pointDotStrokeWidth : 2, //Number - Pixel width of point dot stroke    
            pointHitDetectionRadius : 20, //Number - amount extra to add to the radius to cater for hit detection outside the drawn point    
            datasetStroke : true, //Boolean - Whether to show a stroke for datasets    
            datasetStrokeWidth : 2, //Number - Pixel width of dataset stroke    
            datasetFill : true, //Boolean - Whether to fill the dataset with a colour    
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>", //String - A legend template
            onAnimationProgress: function(){},// Function - Will fire on animation progression.
            onAnimationComplete: function(){}  // Function - Will fire on animation completion.
        };
        Chart.defaults.global.responsive = true;
        var vlc = new Chart(claimBoughtChart).Line(data, options);
    }

  /*========================== ONLOAD ==========================*/
  $scope.getArchiveDetails();
})

.controller('FooducerArchivePromoDetailsCtrl', function($scope, $location, $foodieUtils, $ionicLoading, $ionicNavBarDelegate, $stateParams, Token, Validate) {  
  $scope.getPromoDetails = function(){
    Validate.getValidatePromo(null, {api_key: Token.api_key, fooducer_ID: Token.fooducer_ID, offer_ID: $stateParams.promoID},
      function(successData){
        if(successData.isAuthorized)
          {
            $scope.promotion = successData.result;
            $ionicNavBarDelegate.changeTitle(successData.result.offer_title, 'forward');
          }
        else
          {
            $foodieUtils.confirm("Expired Account","To continue using Foodie, please re-login your account. Re-login now?",function(res){
              if (res){
                //true
                window.localStorage.clear();
                $location.path('/login').replace();
                Token.destroyToken();
              }
            });
          }
      },
      function(error){
          $foodieUtils.errorCatcher(error.status);
      });
  }  

  /*========================== ONLOAD ==========================*/
  $scope.getPromoDetails();
});;


