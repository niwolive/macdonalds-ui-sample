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
let pros = {
  state: new Map([[0, {text: 'Zero'}],
                  [1, {text: 'one'}],
                  [2, {text: 'Two'}]])
};
let cons = {
  state: new Map([[0, {text: 'Zero'}],
                  [1, {text: 'TOTO'}],
                  [2, {text: 'TATA'}]])
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
  Append: data => model => {model.state.set(model.state.size,{text: data}); return model;},
};

const update = Msg => model => Msg(model);

/**
 * VIEW
 */
const view = (signal,model) => {
  const viewHelper = {
    appendOnReturn(e){
      if (e.key === 'Enter')
        signal(Msg.Append(e.target.value))();
    }
  };
  const Container = Children => <ul>{Children}</ul>;
  const ListItem = ([id, {text}]) => <li key={id}>{text}</li>;
  const InputItem = key => <li key={key}><input type="text" onKeyPress={viewHelper.appendOnReturn} /></li>;
  const mapItems = ({state}) => [...state].map(ListItem)
                                          .concat([InputItem(state.size)]);
  return compose(Container, mapItems)(model);
};

// App initialisation
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
    return this.props.view(this.signal.bind(this), this.state.model);
  }
}

const Column = props => (<div>
                             <p>{props.head}</p>
                             {props.children}
                           </div>);
const Board = () => {
  return (<Column head="Eating at MacDonals">
            <Column head="Pros"><EditableList model={pros} update={update} view={view}/></Column>
            <Column head="Cons"><EditableList model={cons} update={update} view={view}/></Column>
          </Column>)
}
ReactDOM.render(<Board />, document.getElementById('app'));
