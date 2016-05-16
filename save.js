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
        rootData = root.call(this).data('save');
      if(!rootData) return undefined;
      rootData = rootData.map(mapping);
      //flattens the array to first saved, or last saved if true, true.
      if (obj === true) {
        rootData = rootData[(deep ? "reduceRight" : "reduce")](function(curr, prev) {
          return $.extend(prev, curr);
        });
      }
      return rootData;
    }else if(obj instanceof $){
    	var r = root.call(this), rootSave = r.data('save'), rO = root.call(obj), objSave = rO.data('save');
      if(!objSave){
      	return this.add(obj);
      }else if(!rootSave){
      	r.data('save', objSave);
      }else if(rootSave && objSave){
        $.each(objSave, function(i, v){
          var index = inArray(v[0], rootSave);
          if(index === -1){
            rootSave.push(v);
          }else{
            rootSave[index][1] = $.extend(true, {}, rootSave[index][1], v[1]);
          }
        });
      }
      return this.add(obj);
    }

    //retrieves and saves the data
    var r = root.call(this), rootSave = r.data('save'), data = [];
    this.each(function() {
      var info = {}, $this = $(this);
      if(rootSave) var index = inArray(this, rootSave);
      for (var key in obj) {        
        if (typeof obj[key] === "string") {
          info[key] = $this[obj[key]]();
        } else if (typeof obj[key] === "object") {
          info[key] = $this[obj[key][0]](obj[key][1]);
        } else if (typeof obj[key] === "function") {
        	prevData = index === -1 ? undefined : rootSave[index][1][key];
          info[key] = obj[key].call(this, prevData);
        }
      }
      if(!rootSave){
      	data.push([this, $.extend(true, {}, info)]);
      }else if(index === -1){
        rootSave.push([this, $.extend(true, {}, info)]);
      }else{
        rootSave[index][1] = $.extend(true, {}, rootSave[index][1], info);
      }
    });    
    if(!rootSave) r.data('save', data);

    //returns this for chainability, kinda the whole point ;)
    return this;
  };

})(jQuery);
