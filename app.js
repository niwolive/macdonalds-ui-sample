/**
 * HELPER FUNCTIONS
 */

/**
 * Composes functions so that compose(first,second,third) 
 * is equivalent to first(second(third))
 *
 * @test: compose(a=>a*a,a=>a+1,(a,b)=>a+b)(1,1) === 9
 */
const compose = (first, ...rest) =>
  rest.length === 0
    ? first
    : (...args) => first(compose(...rest)(...args));

/**
 * MODEL
 *
 */
let model = {
  state: new Map([[0, {text: 'Zero', focused: false}],
                  [1, {text: 'one', focused: false}],
                  [2, {text: '', focused: false}]])
};
/**
 * UPDATE
 * model -> newModel
 */
const Msg = {
  Focus: id => model =>  {
    console.log(`FOCUS ${id}`); return model;
  },
  Blur: model => {console.log("Blur")},
  Change: model => {console.log("Change")},
};

const update = Msg => model => Msg(model);

/**
 * VIEW
 */
const view = (signal,model) => {
  const Container = Children => <ul>{Children}</ul>;
  const ListItem = ([id, {text}]) => <li key={id} onClick={signal(Msg.Focus(id))}>{text}</li>;
  const mapItems = ({state}) => [...state].map(ListItem);
  return compose(Container, mapItems)({...model});
};

// App initialisation
class AppContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {model: props.model};
  }
  signal(msg){
    return () => {
      const model = this.props.update(msg)(this.state.model);
      this.setState({model});
    }
  }
  render() {
    return this.props.view(this.signal.bind(this), this.state.model);
  }
}

ReactDOM.render(<AppContainer model={model} update={update} view={view} />, document.getElementById('app'));



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
