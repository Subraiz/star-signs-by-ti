import React, { Component } from "react";
import styled from "styled-components";
import Cookies from "universal-cookie";
import "./connect.css";

const cookies = new Cookies();

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 350px;

  .auth-video-container {
    width: 350px;
    height: 350px;
    background-color: #f9e3b3;
    border-radius: 10px;
    border: 2px solid #d2a038;
    overflow: hidden;
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }

  p {
    font-family: "Libre Caslon Text", serif;
    font-weight: 300;
    text-align: center;
  }

  .error-message {
    font-family: "Libre Caslon Text", serif;
    font-weight: 300;
    text-align: center;
    color: black;
    margin: 5px 0 0 0;
  }

  .birthday-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    p {
      font-size: 18px;
    }
  }

  .birthday-input-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  input {
    width: 27%;
    background-color: #f8e3b3;
    border-radius: 5px;
    border: 1px solid #d2a038;
    padding: 8px 20px;
    margin-right: 2%;
    font-family: "Libre Caslon Text", serif;
    font-weight: 300;
  }

  a {
    padding: 18px 25px;
    background-color: black;
    color: white;
    font-family: "Libre Caslon Text", serif;
    font-weight: 300;
    text-align: center;
    margin-top: 25px;
    border-radius: 3px;
  }

  @media (max-width: 950px) {
    width: 400px;
    margin-top: 45px;

    .auth-video-container {
      height: 400px;
      width: 400px;
    }
  }

  @media (max-width: 600px) {
    width: 80vw;
    margin-top: 55px;

    .auth-video-container {
      height: 80vw;
      width: 80vw;
      margin-top: -40px;
    }

    .error-message {
      font-size: 14px;
    }

    .birthday-container {
      position: absolute;
      width: 80vw;
      margin: 0 auto;
      margin-top: 475px;
      left: 0;
      right: 0;
    }
  }

  @media (max-width: 415px) {
    .birthday-container {
      position: relative;
      width: 80vw;
      margin: 0 auto;
      left: 0;
      right: 0;
    }
  }
`;

class SpotifyAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      birthMonth: "",
      birthDate: "",
      birthYear: "",
      errorMessage: undefined,
      href: undefined
    };
  }

  componentDidMount = () => {
    cookies.set("birthMonth", this.state.birthMonth, { path: "/" });
    cookies.set("birthDate", this.state.birthDate, { path: "/" });
    cookies.set("birthYear", this.state.birthYear, { path: "/" });

    setInterval(() => {
      if (
        this.state.birthMonth &&
        this.state.birthDate &&
        this.state.birthYear &&
        this.state.birthYear.length === 4
      ) {
        console.log("check age");

        const today = new Date();

        const birth = new Date(
          this.state.birthYear,
          this.state.birthMonth,
          this.state.birthDate
        );

        const diffTime = Math.abs(today - birth);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const age = diffDays / 365;

        if (age < 14) {
          this.setState({
            errorMessage:
              "You must be at least 14 to continue with this experience."
          });
        } else {
          this.setState({ href: `${this.props.serverUrl}/auth` });
        }
      }
    }, 50);
  };

  handleBirthChange = e => {
    const value = e.target.value;
    const prop = e.target.name;
    const isNumber = !/\D/.test(value);

    if (isNumber) {
      if (prop === "birthMonth") {
        if (value.length > 2) {
          return false;
        } else if (value > 12) {
          return false;
        } else if (String(value) === "00") {
          return false;
        }
      } else if (prop === "birthDate") {
        if (value.length > 2) {
          return false;
        } else if (value > 31) {
          return false;
        } else if (String(value) === "00") {
          return false;
        }
      } else if (prop === "birthYear") {
        if (value.length > 4) {
          return false;
        }
      }

      this.setState({
        [prop]: value,
        errorMessage: undefined
      });
      cookies.set(prop, value, { path: "/" });
    } else {
      this.setState({
        errorMessage: "Please enter a number for month, day, and year."
      });
    }
  };

  renderErrorMessage = () => {
    const { errorMessage } = this.state;

    if (errorMessage !== undefined) {
      return <p className="error-message">{errorMessage}</p>;
    }
  };

  render() {
    const { birthMonth, birthDate, birthYear, href } = this.state;
    return (
      <Container>
        <div className="auth-video-container">
          <img src={require("../assets/static.jpg")} alt="ti" />
        </div>

        <div className="birthday-container">
          <p>Select your birthdate and get your horoscope.</p>
          <div className="birthday-input-container">
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Month"
              name="birthMonth"
              value={birthMonth}
              onChange={e => this.handleBirthChange(e)}
            />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Day"
              name="birthDate"
              value={birthDate}
              onChange={e => this.handleBirthChange(e)}
            />
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Year"
              name="birthYear"
              value={birthYear}
              onChange={e => this.handleBirthChange(e)}
            />
          </div>
          {this.renderErrorMessage()}
          <a className="save-btn connect-btn" href={href}>
            Connect to Spotify
          </a>
        </div>
      </Container>
    );
  }
}

export { SpotifyAuth };
