(function($) {

  //find the root||start of the chain.
  let saved = new WeakMap(),
    root = function(root) {
      while (root.prevObject.prevObject) {
        root = root.prevObject;
      }
      return root[0];
    };

  $.fn.save = function(obj, deep) {

    let r = root(this), rootSave = saved.get(r), data = rootSave || new Map(), objStr = typeof obj === "string";

    //returns the data
    if (!obj || objStr || obj === true) {
      if (!rootSave) return undefined;
      let map = [], mapping = objStr ? v => map[map.length] = v[obj] : v => map[map.length] = v;
      rootSave.forEach(mapping);
      //flattens the array to first saved, or last saved if true, true.
      if (obj === true) map = map[(deep ? "reduceRight" : "reduce")]((curr, prev) => $.extend(prev, curr));
      return map;
    } else if (obj instanceof $) {
      let rO = root(obj), objSave = saved.get(rO);
      if (!objSave) return this.add(obj);
      else if (!rootSave) saved.set(r, objSave);
      else if (rootSave && objSave) objSave.forEach((v, k) => rootSave.set(k, $.extend(true, rootSave.get(k), v)));
      return this.add(obj);
    }

    //retrieves and saves the data
    this.each(function() {
      let info = {}, $this = $(this), index;
      if (rootSave) index = rootSave.get(this);
      for (let key in obj) {
        let objKey = typeof obj[key];
        if (objKey === "string") info[key] = $this[obj[key]]();
        else if (objKey === "object") info[key] = $this[obj[key][0]](obj[key][1]);
        else if (objKey === "function") info[key] = obj[key].call(this, index ? index[key] : undefined);
      }
      data.set(this, $.extend(true, index, info));
    });
    if (!rootSave) saved.set(r, data);

    //returns this for chainability, kinda the whole point ;)
    return this;
  };

})(jQuery);
