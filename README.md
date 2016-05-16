# jQuery-save

##Description
Save data without breaking the jQuery chain. The data can then be retrieved and accessed afterwards. The data is typically saved as an array of ojects, the number of arrays depending on the number of elements that some data was saved for. In each array is an object containing the data seporated by key-value pairs. The key is an id set by the user when saving the data and the data can be retrieved using one of the many jQuery methods, or a function, which is then saved to the object.

Retrieving the data at the end of the chain returns the array containing the data that was saved during any part of the chain. This is escpecially useful for saving data on multiple elements while traversing the DOM and then retrieving all of the saved data at once.


##Documentation
`.save({id: method [, id: method [, id: method [, ...etc ] ] ] } )`

**id**

Type: String

The id used to save the data, which acts as the key when retrieved.

**method**

Type: String

If the jQuery method used to retrive the data does not require an argument then a string may be used, such as "html".

Type: Array

If the method requires an argument then the values must be entered as an array containing the strings, such as ["attr", "title"].

Type: Function

A function may be passed in to acquire more complex information. The return value of the function will be the data that is saved.


`.save([flatten [, last saved ] )`

**flatten**

Type: Boolean

If true, the array of objects will be reduced to the first data entered, seporated by its ID.

**last saved** 

Type: Boolean

If also passed, the array of objects will be reduced to the last saved data, seporated by its ID.


##Examples
```javascript
$('#foo').save({txt: 'text'});
```
The code above will save the text of the element as txt.
   
   
```javascript
$('#foo').save({
  txt: 'text',
  html: 'html'
});
```
The code above will save the html and text of the element.
   
   
```javascript
$('.bar').save({txt: 'text'});
```
The code above will save the text for all the elements selected.
   
   
```javascript
$('.bar').save({info: ['attr', 'title']}).next().save({id: ['attr', 'id'], html: 'html'});
```
The above will save the title attribute of all .bar elements as info and on the next elements will save the id and html.
   
   
```javascript
$('.bar').save({id: function(){
  return $(this).index();
});
```
The above will save the elements index as its id. The return value will be used as the data to save. It can be any type of value, even objects!
   
   
```javascript
$('.bar').save(function(val){
  return val ? $.extend(val, newObj) : newObj;
});
```

   ---

```javascript
$('.bar').save({html: 'html'}).save();
```
This would output the following, assuming two elements with the bar class.
```javascript
[
  {
    html: "foo"
  },
  {
    html: "bar"
  }
]
```
The above will save the html of each element and then retrieve it. The output will be an array of objects.
   
   
```javascript
$('.bar').save({html: 'html', href: ['attr', 'href']}).save();
```
This would output the following, assuming two elements with the bar class.
```javascript
[
  {
    html: "foo",
    href: "www.somedomain.com"
  },
  {
    html: "bar",
    href: "www.someother.com"
  }
]
```
The above would save the html and href of each element and the output the data as an array of objects.
   
   
```javascript
$('.bar').save({html: 'html', info: ['attr', 'title']}).next().save({link: ['attr', 'href']}).save();
```
This would output the following, assuming two elements with the bar class.
```javascript
[
  {
    html: "bar",
    info: "A bar"
  },
  {
    html: "bar",
    info: "Another bar"
  },
  {
  },
  {
    link: "www.someother.com"
  }
]
```
The above will save the html and title attribute of the selected elements, then save the href attribute of the next elements. If any element doesn't contain the specified value then an empty object is placed within the array to preserve the order of elements.
   
   
```javascript
$('.bar').save({info: ['attr', 'title']}).next().save({text: 'text'}).prev().save({link: ['attr', 'href']}).save();

[
  {
    info: "something",
    link: "www.something.com"
  },
  {
    link: "someother"
  },
  {
  },
  {
    text: "bar"
  }
]
```
The above will amend any existing objects for elements that already exist. Any elements that does not contain the specified data will have an empty object to preserve the order of elements.
   
   
```javascript
$('a').save({html: 'html', link: ['attr', 'href'], info: ['attr', 'title']}).save('link');

//["www.somedomain.com", "www.someother.com"];
```
The above will return an array containing only the data for the id specified in the argument.
   
   
```javascript
$('.foo').save({link: ['attr', 'href'], info: ['attr', 'title']}).save('info');

//["something", undefined, "someother"];
```
The above will output an array containing the content of the title attribute. If any element doesn't contain the specified data then `undefined` will be returned to preserve the order of elements.
   
   
```javascript
$('.foo').save({html: 'html', text: 'text', info: ['attr', 'title']}).save(true);

{
  html: "<b>Foo</b>",
  text: "Foo",
  info: "Something about Foo",
}
```
Passing `true` into the argument when retrieving the saved data will return a single flattened (`extend`ed) object containing all unique keys for the first data that was inserted. Passing `save(true, true)` will return an object with the last saved data entered. This is useful for traversing the DOM while saving pieces of information when the specified element is not required.

---

Adding additional elements into the chain is possible by passing in the jQuery elements into the `save` method. Any data that is also saved on those elements will be included and then the elements will be added to the chain, similar to using the jQuery `add` method.
```javascript
var foo = $('.foo').save({
  html: 'html'
});

var bar = $('.bar').save({
  text: 'text'
}).save(foo).save({
  info: ['attr', 'title']
});

console.log(bar.save());

[
  {
    text: "bar",
    info: "This is bar"
  },
  {
    text: "Another bar",
    info: "This is another bar"
  },
  { 
    html: "<b>Foo</b>",
    info: "This is foo"
  },
  {
    html: "<b>Foo number 2</b>",
    info: "This is a second foo"
  }
]
```
The output will be in the order of bar followed by foo, because foo was added onto bar. They would both contain the title as info because that was saved after foo was added.

Any eagle eyed readers might have seen that the jQuery chain can be cached in a variable and then accessed again at some point further down the script. This allows further code to be ran that might alter the data being saved. Perhaps a log of info from several input boxes when the user presses "Go".
