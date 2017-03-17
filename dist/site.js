'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * HELPER FUNCTIONS
 */

/**
 * Composes functions so that compose(first,second,third) 
 * is equivalent to first(second(third))
 *
 * @test: compose(a=>a*a,a=>a+1,(a,b)=>a+b)(1,1) === 9
 */
var compose = function compose(first) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  return rest.length === 0 ? first : function () {
    return first(compose.apply(undefined, rest).apply(undefined, arguments));
  };
};

/**
 * MODEL
 *
 */
var model = {
  state: new Map([[0, { text: 'Zero', focused: false }], [1, { text: 'one', focused: false }], [2, { text: '', focused: false }]])
};
/**
 * UPDATE
 * model -> newModel
 */
var Msg = {
  Focus: function Focus(model) {
    return function (id) {
      var entry = model.state.get(id);
      model.state.set(id, Object.assign(entry, { focused: true }));
    };
  },
  Blur: function Blur(model) {
    console.log("Blur");
  },
  Change: function Change(model) {
    console.log("Change");
  }
};

var update = function update(Msg) {
  return function (model) {
    return Msg(model);
  };
};

/**
 * VIEW
 */
// EditableList - An editable list of items

var Container = function Container(Children) {
  return React.createElement(
    'ul',
    null,
    Children
  );
};
var ListItem = function ListItem(_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      id = _ref2[0],
      text = _ref2[1].text;

  return React.createElement(
    'li',
    { key: id, onClick: function onClick() {
        return update(Msg.Focus)(model)(id);
      } },
    text
  );
};
var mapItems = function mapItems(_ref3) {
  var state = _ref3.state;
  return [].concat(_toConsumableArray(state)).map(ListItem);
};
var List = compose(Container, mapItems);

// App initialisation
List.render = function (node) {
  return function (props) {
    return ReactDOM.render(React.createElement(List, props), node);
  };
};
var render = List.render(document.getElementById('app'));
render(model);

//const Column = props => (<div>
//                             <p>{props.head}</p>
//                             {props.children}
//                           </div>);
//
//
//const Board = () => {
//  return (<Column head="Eating at MacDonals">
//            <Column head="Pros"><EditableList /></Column>
//            <Column head="Cons"><EditableList /></Column>
//          </Column>)
//}
//

