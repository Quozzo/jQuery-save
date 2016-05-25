(function($) {

  //find the root||start of the chain.
  let saved = new WeakMap(),
    root = function() {
      let root = this.filter(':first');
      while (root.prevObject.prevObject) {
        root = root.prevObject;
      }
      return root[0];
    };

  $.fn.save = function(obj, deep) {

    let r = root.call(this),
      rootSave = saved.get(r),
      data = rootSave || new Map();

    //returns the data
    if (!obj || typeof obj === "string" || obj === true) {
      if (!rootSave) return undefined;
      let map = [],
        mapping = (typeof obj === "string") ? function(v) {
          map[map.length] = v[obj];
        } : function(v) {
          map[map.length] = v;
        };
      rootSave.forEach(mapping);
      //flattens the array to first saved, or last saved if true, true.
      if (obj === true) map = map[(deep ? "reduceRight" : "reduce")]((curr, prev) => $.extend(prev, curr));
      return map;
    } else if (obj instanceof $) {
      let rO = root.call(obj),
        objSave = saved.get(rO);
      if (!objSave) {
        return this.add(obj);
      } else if (!rootSave) {
        saved.set(r, objSave);
      } else if (rootSave && objSave) {
        objSave.forEach((v, k) => rootSave.set(k, $.extend(true, rootSave.get(k), v)));
      }
      return this.add(obj);
    }

    //retrieves and saves the data
    this.each(function() {
      let info = {},
        $this = $(this),
        index;
      if (rootSave) index = rootSave.get(this);
      for (let key in obj) {
        if (typeof obj[key] === "string") {
          info[key] = $this[obj[key]]();
        } else if (typeof obj[key] === "object") {
          info[key] = $this[obj[key][0]](obj[key][1]);
        } else if (typeof obj[key] === "function") {
          let prevData = index ? index[key] : undefined;
          info[key] = obj[key].call(this, prevData);
        }
      }
      data.set(this, $.extend(true, index, info));
    });
    if (!rootSave) saved.set(r, data);

    //returns this for chainability, kinda the whole point ;)
    return this;
  };

})(jQuery);
