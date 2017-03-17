const state = {};
const ListItem = state => <li>{state.}</li>;

const ListContainer = Item =>
                      state => 
                        (<ul>
                           gb
                         </ul>)

const EditableList = state => {
  return compose(ListContainer, ListItem, state);
}


EditableList.render = node => 
                      props => 
                      ReactDOMServer.renderToStaticMarkup(<EditableList {...props} />, node)

<ul>
  <li>Item1</li>
  <li>Item2</li>
  <li>Item4</li>
  <li>Item3</li>
  <li>Item5</li>
  <li>Item2</li>
</ul>
