/**
 * UTILITIES
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
 */
let model = { state: new Map() };

/**
 * UPDATE
 * return an updated copy of the model, without ever mutating the original data
 */
const Msg = { append: data => model => 
               Object.assign(model.state, { state: new Map(model.state.entries())
                                                     .set(model.state.size, data) })
};

const update = msg => model => msg(model);

/**
 * VIEW
 * This function is used in the EditableList React component to allow binding a 
 * signal: allows the update messages to be attached to specific instance of a React component
 * model: allows an instance-specific state to be bound as the model for the view
 */
const view = (signal, model) => {
  // When handling keypresses, trigger the 'append' signal only if key 'Enter' is pressed
  const appendOnReturn = evt => (evt.key === 'Enter') && signal(Msg.append(evt.target.value))();

  const Container = Children => <ul>{Children}</ul>;
  const ListItem = ([id, text]) => <li key={id}>{text}</li>;
  const InputItem = key => <li key={key}>
                             <input type="text" onKeyPress={appendOnReturn} autoFocus />
                           </li>;
  const mapItems = ({state}) => [...state].map(ListItem)
                                          .concat([InputItem(state.size)]);
  // Embed in a container the list of all the list items matching the given model
  return compose(Container, mapItems)(model);
};


// Create a component that will retain states of different list instances
class EditableList extends React.Component {
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
    // Apply the view to the instance, binding its signal function to the current instance, and its model to the state of the current instance
    return this.props.view(this.signal.bind(this), this.state.model);
  }
}
EditableList.defaultProps = {model: model, update: update, view: view};

/**
 * MAIN App
 */
// Wrap two list instances inside a board made of columns
const Column = props => (<div className={(props.className || "") + " column"}>
                           <p className="col-head">{props.head}</p>
                           {props.children}
                         </div>);
const Board = () => {
  return (<Column className="board" head="Eating at MacDonals">
            <Column head="Pros"><EditableList /></Column>
            <Column head="Cons"><EditableList /></Column>
          </Column>);
}
ReactDOM.render(<Board />, document.getElementById('app'));
