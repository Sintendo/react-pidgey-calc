import React, { Component } from 'react';
import SuicidalButton from './SuicidalButton';
import logo from './logo.svg';
import './App.css';
import Database from './database';

class App extends Component {
  constructor(props) {
    super(props);
    this.sentinel = {index: 0, name: '---'};
    this.state = {
      dropdown: [this.sentinel].concat(Database),
      currentSelection: Database[0].index,
      selected: []
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleDropdownChange(event) {
    console.log('event', typeof event.target.value, event.target.value);
    this.setState({currentSelection: Number(event.target.value)});
  }
  handleAdd() {
    console.log('add');
    this.setState(({dropdown, currentSelection, selected}) => {
      if (currentSelection === this.sentinel.index) {
        console.log('dummy entry selected');
        return;
      }
      let index = dropdown.findIndex((el) => el.index == currentSelection);
      if (index < 0) {
        return;
      }
      let entry = dropdown[index];
      dropdown = dropdown.slice(0, index).concat(dropdown.slice(index + 1));
      selected = selected.concat({pokedex: entry, count: 0, candy: 0});
      return { dropdown, selected };
    });
  }
  handleRemove(el, index) {
    console.log('remove', el, index);
    let dropdown = this.state.dropdown.concat(el.pokedex);
    let selected = this.state.selected;
    selected = selected.slice(0, index).concat(selected.slice(index + 1));
    this.setState({ dropdown, selected });
  }

  handleSpinnerChange(event, el, index, field) {
    console.log(`setting ${index} ${field} to ${event.target.value}`, typeof event.target.value);
    let newEntry = Object.assign({}, el, {[field]: Number(event.target.value)});
    let selected = this.state.selected.concat();
    selected[index] = newEntry;
    this.setState({ selected });
  }
  
  calculate(mons, candy, cost, transferAfter) {
    let plan = [];
    let evolutions = 0;
    let pretransfers = 0;

    function doEvolutions() {
      while (cost <= candy && mons > 0) {
        console.log({mons, candy, cost});
        let div = Math.min(mons, candy / cost | 0);
        let rem = candy - div * cost;
        
        mons -= div;
        evolutions += div;
        // you get back one candy after an evolution
        candy = rem + div;
      }
    }

    while (cost <= candy || candy + mons > cost) {
      doEvolutions();

      if (evolutions > 0) {
        plan.push({evolve: evolutions});
        if (transferAfter) {
          candy += evolutions;
          plan.push({transferEvolutions: evolutions});
        }
        evolutions = 0;
      } else {
        while (candy < cost && cost < candy + mons) {
          let diff = cost - candy;
          mons -= diff;
          candy += diff;
          pretransfers += diff;
        }
      }
    }

    if (pretransfers > 0) {
      plan.unshift({pretransfer: pretransfers});
    }
    return plan;
  }

  render() {
    let dropdownItems = this.state.dropdown.map((el) =>
        <option key={el.index} value={el.index}>{el.name}</option>
    );
    let selectedItems = this.state.selected.map((el, index) =>
      <li key={el.pokedex.index}>
        {el.pokedex.name}
        <input type="number" value={el.count} min="0" onChange={(event) => this.handleSpinnerChange(event, el, index, 'count')} />
        <input type="number" value={el.candy} min="0" onChange={(event) => this.handleSpinnerChange(event, el, index, 'candy')}/>
        <button onClick={() => this.handleRemove(el, index)}>Remove</button>
      </li>
    );
    let transferItems = this.state.selected.map((el) => {
      let plan = this.calculate(el.count, el.candy, el.pokedex.evolves[0], true);
      plan = JSON.stringify(plan);
      return <p key={el.pokedex.index}>{el.pokedex.name}: {plan}</p>
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React!!</h1>
        </header>
        
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <select value={this.state.currentSelection} onChange={this.handleDropdownChange}>{dropdownItems}</select>
        <button onClick={this.handleAdd}>Add</button>
        <br/>
        <ul>{selectedItems}</ul>
        <div>{transferItems}</div>

        <SuicidalButton />
      </div>
    );
  }
}

export default App;
