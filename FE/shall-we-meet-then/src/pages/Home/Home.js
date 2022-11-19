import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import "./Home.css";
import axios from "axios";

import styled from "styled-components";

import Swal from "sweetalert2";

import FindPassword from "../FindPassword/FindPassword";
import LoginForm from "../../Components/Home/LoginForm";

function InfoMsg(props) {
  return (
    <div>
      {props.check ? (
        <p
          className="message"
          style={{ color: "red", margin: "0 0 0 0", textAlign: "left" }}
        >
          {" "}
          이미 사용중인 이메일입니다.
        </p>
      ) : (
        <p
          className="message"
          style={{ color: "green", margin: "0 0 0 0", textAlign: "left" }}
        >
          사용가능한 이메일입니다.
        </p>
      )}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  // 회원가입용 state
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpPasswordCheck, setSignUpPasswordCheck] = useState("");
  // 로그인용 state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  // 중복검사용
  const [isDuplicated, setIsDuplicated] = useState(null);

  const[showLogin, setShowLogin] = useState(true)
  const[showRegister, setShowRegister] = useState(false)
  const[showFindPassword, setShowFindPassword] = useState(false)

  // 회원가입 함수
  const signUp = () => {
    if (isDuplicated) {
      // alert('이메일 중복검사를 해주세요');
      Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: "이메일 중복검사를 해주세요",
      });
      return;
    } else {
      if (signUpPassword === signUpPasswordCheck) {
        axios({
          method: "post",
          url: "https://server.shallwemeetthen.com/members/join",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            email: signUpEmail,
            password: signUpPassword,
          },
        })
          .then((r) => {
            console.log(r);
            if (r.data) {
              changeToLoginForm();
            } else {
              // alert('이메일 또는 비밀번호 형식이 맞지 않습니다.')
              Swal.fire({
                icon: "error",
                title: "회원가입 실패",
                text: "이메일 또는 비밀번호 형식이 맞지 않습니다.",
              });
            }
          })
          .catch((error) => {
            // if (error.response.status === 401) {
            //   // setWrongInputData(true);
            // }
          });
      } else {
        // alert('비밀번호가 다릅니다.')
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: "비밀번호가 다릅니다.",
        });
      }
    }
  };

  // 로그인 함수
  const signIn = () => {
    // axios.post('http://43.201.82.64/members/login',{email: signInEmail,password: signInPassword,})
    axios({
      method: "post",
      url: "https://server.shallwemeetthen.com/members/login",
      headers: {
        "Content-Type": "application/json",
        // withCredentials: true
      },
      data: {
        email: signInEmail,
        password: signInPassword,
      },
    })
      .then((res) => {
        if (res.data === true) {
          sessionStorage.setItem("accessToken", res.headers.authorization);
          navigate("/main");
        } else {
          // alert('존재하지 않는 아이디 이거나 잘못된 비밀번호입니다')
          Swal.fire({
            icon: "error",
            title: "로그인 실패",
            text: "아이디 또는 비밀번호를 다시 확인해주세요!",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디 또는 비밀번호를 다시 확인해주세요!",
        });
      });
  };

  //이메일 중복 체크
  const checkDuplicatedEmail = () => {
    if (signUpEmail === "") {
      // alert('이메일을 입력해주세요');
      Swal.fire({
        icon: "error",
        title: "검증 실패",
        text: "이메일을 입력해주세요",
      });
      return;
    }

    axios({
      method: "get",
      url: "https://server.shallwemeetthen.com/members/check-email",
      params: {
        email: signUpEmail,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((r) => {
        if (r.data === true) {
          setIsDuplicated(true);

          Swal.fire({
            icon: "error",
            title: "가입 실패",
            text: "이미 존재하는 이메일입니다",
          });
        } else {
          setIsDuplicated(false);
        }
      })
      .catch((err) => {});
  };

  const changeToRegisterForm = () =>{
    setShowRegister(!showRegister)

    setShowFindPassword(false)
    setShowLogin(false)
  }

  const changeToFindPasswordForm = () =>{
    setShowFindPassword(!showFindPassword)

    setShowRegister(false)
    setShowLogin(false)
  }

  const changeToLoginForm = () => {
    setShowLogin(!showLogin)

    setShowRegister(false)
    setShowFindPassword(false)
  }

  const stopEvent = (e) => {
    e.preventDefault();
    return false;
  };


  return (
    <div className="landing__bg">
      {/* 회원가입 */}
      <div className="login-page">
        <div className="login-text-img">
          <img
            alt=""
            src={process.env.PUBLIC_URL + "/assets/icon-img/logo_4.png"}
          />
          <div className="text-then-img">
            <img
              style={{ width: "128px", height: "88px" }}
              alt=""
              src={process.env.PUBLIC_URL + "/assets/icon-img/then-logo.png"}
            />
          </div>
        </div>

        <ShiningLoginComponent>
          <div className="form">
            {
              showLogin === true
              ? (
                  <LoginForm 
                    stopEvent={stopEvent} 
                    signInEmali={signInEmail} setSignInEmail={setSignInEmail} 
                    signInPassword = {signInPassword}  setSignInPassword={setSignInPassword} 
                    signIn={signIn}
                    changeToFindPasswordForm={changeToFindPasswordForm} 
                    changeToRegisterForm={changeToRegisterForm} 
                    />
              )
              :(
                <>
                </>
              )
            }

            {
              showRegister === true
              ?(
                <form className="register-form" onSubmit={stopEvent}>
                  <input
                    type="text"
                    style={{ margin: "0 0 0 0" }}
                    placeholder="email address"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                    }}
                    onBlur={checkDuplicatedEmail}
                  />
                  {isDuplicated === null ? <></> : <InfoMsg check={isDuplicated} />}

                  <input
                    type="password"
                    style={{ margin: "15px 0 15px 0" }}
                    placeholder="password"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                    }}
                  />
                  <input
                    type="password"
                    placeholder="password check"
                    value={signUpPasswordCheck}
                    onChange={(e) => {
                      setSignUpPasswordCheck(e.target.value);
                    }}
                  />
                  <button onClick={signUp}>create</button>
                  <p className="message">
                    아이디가 있으신가요? &nbsp;&nbsp;&nbsp;
                    <a onClick={changeToLoginForm} href="#">
                      로그인
                    </a>
                  </p>
                </form>
              )
              :(
                <></>
              )
            }
            {
              showFindPassword === true
              ? (
                  <FindPassword 
                    stopEvent={stopEvent} 
                    changeToLoginForm={changeToLoginForm}
                    changeToRegisterForm={changeToRegisterForm}
                  />
              )
              :(
                <>
                </>
              )
            }
          {/* <FindPassword /> */}
          </div>
        </ShiningLoginComponent>
      </div>
    </div>
  );
}

export default Home;

export const ShiningLoginComponent = styled.div`
  width: 26.5rem;
  height: 26rem;
  border-radius: 3rem;
  box-shadow: 0.2rem 0.2rem 1.2rem var(--pink),
    -0.2rem -0.2rem 1.2rem var(--pink);
  padding: 1rem;
  display: flex;
  margin: 12vh auto 0 auto;
`;