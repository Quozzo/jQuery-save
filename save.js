(function($) {

  //return the index of the item in its nested array
  function inArray(val, arr) {
    var i = arr.length;
    while (i--) {
      if (val == arr[i][0]) {
        return i;
      }
    }
    return -1;
  }

  //find the root||start of the chain.
  function root() {
    var root = this.filter(':first');
    while (root.prevObject.prevObject) {
      root = root.prevObject;
    }
    return root;
  }
  
  
  $.fn.save = function(obj, deep) {
    //returns the data
    if (!obj || typeof obj === "string" || obj === true) {
      var mapping = (typeof obj === "string") ? function(v) {
          return v[1][obj];
        } : function(v) {
          return v[1];
        },
        rootData = root.call(this).data('save').map(mapping);
      //flattens the array to first saved, or last saved if true, true.
      if (obj === true) {
        rootData = rootData[(deep ? "reduceRight" : "reduce")](function(curr, prev) {
          return $.extend(prev, curr);
        });
      }
      return rootData;
    }
    
    //retrieves the data
    var data = this.map(function() {
      var data = {},
        $this = $(this);
      for (var key in obj) {
        if (typeof obj[key] === "string") {
          data[key] = $this[obj[key]]();
        } else if (typeof obj[key] === "object") {
          data[key] = $this[obj[key][0]](obj[key][1]);
        } else if (typeof obj[key] === "function") {
          data[key] = obj[key].call(this);
        }
      }
      return [
        [this, data]
      ];
    }).get();
    
    //saves it to the root element
    var r = root.call(this),
      rootSave = r.data('save');
    if (rootSave) {
      for (var i = 0, k = data.length; i < k; i++) {
        var index = inArray(data[i][0], rootSave);
        if (index > -1) {
          rootSave[index][1] = $.extend(true, {}, rootSave[index][1], data[i][1]);
        } else {
          rootSave[rootSave.length] = data[i];
        }
      }
    } else {
      r.data('save', data);
    }

    //returns this for chainability, kinda the whole point ;)
    return this;
  };
  
})(jQuery);
