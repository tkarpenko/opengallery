angular.module('ogResources').factory('ogAddPaintingResource', 
  ['ogApiUrl', '$resource', 
  
  function(
    ogApiUrl,
    $resource 
  ) {
  return $resource( ogApiUrl+'/confidential/paintings/add/:pId', {pId: '@pId'},
    {
      getPrevPaintingID: {
        method: 'GET'
      },
      save: {
        method: 'POST',

        // Next request header is necessary for success sending
        // of form with File object.
        // This requst header will be automatically changed to
        // 'content-type': 'multipart/form-data; boundary=[...]'
        headers: {'Content-Type': undefined},

        // Before request is sending to server
        // the new JavaScript FormData object is filled by
        // AddPainting form data.
        // The sending data as FormData object lets to send both
        // the text and the File 
        // in the same request to the same URL in the same time
        transformRequest : function(data) {
          if (data === undefined) { return; }

          var paintingData = new FormData();

          angular.forEach(data, function(value, key) {
            
            if (value instanceof FileList) {
              paintingData.append(key, value[0]);

            } else if (key !== '$promise' && key !== '$resolved') {
              paintingData.append(key, value);
            }
          });
          return paintingData;
        },
      }
    }
  );
}]);