/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface HelloProps {
  greeting: string;
}

interface HelloState {
  inputName: string;
  outputName: string;
}

interface InputProps {
  name: string;
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
}

const Input: React.SFC<InputProps> = props => {
  const { name, handleChange }: InputProps = props;
  return (
    <input
      type="text"
      placeholder="Input any name"
      value={name}
      onChange={handleChange}
    />
  );
};

interface ButtonProps {
  handleClick: () => void;
}

const Button: React.SFC<ButtonProps> = props => {
  const { handleClick }: ButtonProps = props;
  return <button onClick={handleClick}>Say Hello</button>;
};

interface OutputProps {
  greeting: string;
  name: string;
}

const Output: React.SFC<OutputProps> = props => {
  const { greeting, name }: OutputProps = props;
  const hasName: boolean = name !== '';
  const result: JSX.Element | '' = hasName ? (
    <h1>
      {greeting} {name}!
    </h1>
  ) : (
    ''
  );
  return <div>{result}</div>;
};

class Hello extends React.Component<HelloProps, HelloState> {
  constructor(props: HelloProps) {
    super(props);
    this.state = {
      inputName: '',
      outputName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event: React.FormEvent<HTMLInputElement>): void {
    this.setState({
      inputName: event.currentTarget.value
    });
  }

  handleClick(): void {
    this.setState({
      inputName: '',
      outputName: this.state.inputName
    });
  }

  render(): JSX.Element {
    const { greeting } = this.props;
    return (
      <div>
        <Input name={this.state.inputName} handleChange={this.handleChange} />
        <Button handleClick={this.handleClick} />
        <Output greeting={greeting} name={this.state.outputName} />
      </div>
    );
  }
}

ReactDOM.render(
  <Hello greeting="Hello!" />,
  document.querySelector('.content')
);
