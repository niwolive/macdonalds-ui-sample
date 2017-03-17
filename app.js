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
  Focus: model => id => {
    const entry = model.state.get(id);
    model.state.set(id, Object.assign(entry, {focused: true}));
  },
  Blur: model => {console.log("Blur")},
  Change: model => {console.log("Change")},
};

const update = Msg => model => Msg(model);

/**
 * VIEW
 */
// EditableList - An editable list of items

const Container = Children => <ul>{Children}</ul>;
const ListItem = ([id, {text}]) => 
                   <li key={id} onClick={() => update(Msg.Focus)(model)(id)}>{text}</li>;
const mapItems = ({state}) => 
                   [...state].map(ListItem);
const List = compose(Container, mapItems);

// App initialisation
List.render = node => props => ReactDOM.render(<List {...props} />, node);
const render = List.render(document.getElementById('app'));
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
