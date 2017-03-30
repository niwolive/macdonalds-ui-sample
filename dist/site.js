'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
var model1 = {
  state: new Map([[0, { text: 'Zero' }], [1, { text: 'one' }], [2, { text: 'Two' }]])
};
var model2 = {
  state: new Map([[0, { text: 'Zero' }], [1, { text: 'TOTO' }], [2, { text: 'TATA' }]])
};
/**
 * UPDATE
 * model -> newModel
 */
var Msg = {
  Focus: function Focus(id) {
    return function (model) {
      console.log('FOCUS ' + id);return model;
    };
  },
  Blur: function Blur(model) {
    console.log("Blur");
  },
  Append: function Append(data) {
    return function (model) {
      model.state.set(model.state.size, { text: data });return model;
    };
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
var view = function view(signal, model) {
  var viewHelper = {
    appendOnReturn: function appendOnReturn(e) {
      if (e.key === 'Enter') signal(Msg.Append(e.target.value))();
    }
  };
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
      { key: id },
      text
    );
  };
  var InputItem = function InputItem(key) {
    return React.createElement(
      'li',
      { key: key },
      React.createElement('input', { type: 'text', onKeyPress: viewHelper.appendOnReturn })
    );
  };
  var mapItems = function mapItems(_ref3) {
    var state = _ref3.state;
    return [].concat(_toConsumableArray(state)).map(ListItem).concat([InputItem(state.size)]);
  };
  return compose(Container, mapItems)(model);
};

// App initialisation

var EditableList = function (_React$Component) {
  _inherits(EditableList, _React$Component);

  function EditableList(props) {
    _classCallCheck(this, EditableList);

    var _this = _possibleConstructorReturn(this, (EditableList.__proto__ || Object.getPrototypeOf(EditableList)).call(this, props));

    _this.state = { model: props.model };
    return _this;
  }

  _createClass(EditableList, [{
    key: 'signal',
    value: function signal(msg) {
      var _this2 = this;

      return function () {
        var model = _this2.props.update(msg)(_this2.state.model);
        _this2.setState({ model: model });
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.view(this.signal.bind(this), this.state.model);
    }
  }]);

  return EditableList;
}(React.Component);

var Column = function Column(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p',
      null,
      props.head
    ),
    props.children
  );
};
var Board = function Board() {
  return React.createElement(
    Column,
    { head: 'Eating at MacDonals' },
    React.createElement(
      Column,
      { head: 'Pros' },
      React.createElement(EditableList, { model: model1, update: update, view: view })
    ),
    React.createElement(
      Column,
      { head: 'Cons' },
      React.createElement(EditableList, { model: model2, update: update, view: view })
    )
  );
};
ReactDOM.render(React.createElement(Board, null), document.getElementById('app'));

