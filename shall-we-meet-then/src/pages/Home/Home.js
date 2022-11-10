import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import './Home.css';
import axios from 'axios';





function InfoMsg(props) {
  return(
    <div>
      {props.check ? <p className="message" style={{color:'red', margin:'0 0 0 0', textAlign:'left'}}> 이미 사용중인 이메일입니다.</p>
       : <p className="message" style={{color:'green', margin:'0 0 0 0',  textAlign:'left'}}>사용가능한 이메일입니다.</p>}
    </div>
  )
}






function Home() {

  

  // 회원가입용 state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPasswordCheck, setSignUpPasswordCheck] = useState('');
  // 로그인용 state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  // 중복검사용
  const [isDuplicated, setIsDuplicated] = useState(null);



  const navigate = useNavigate();

  const goFindPassword = () => {
    navigate('/find-password')
  }



  // 회원가입 함수
  const signup = () => {
    if (isDuplicated) {
      alert('이메일 중복검사를 해주세요');
      return
    }
    else {
      if (signUpPassword === signUpPasswordCheck) {
        axios({
          method: 'post',
          url: 'http://k7d105.p.ssafy.io:8080/members/join',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            email: signUpEmail,
            password: signUpPassword,
          },
        })
          .then((r) => {
            console.log(r)
            if(r.data){
              changeForm();
            }
            else{
              alert('이메일 또는 비밀번호 형식이 맞지 않습니다.')
            }
          })
          .catch(error => {
            // if (error.response.status === 401) {
            //   // setWrongInputData(true);
            // }
          })
      }
      else {
        alert('비밀번호가 다릅니다.')
      }
    }
  }





  // 로그인 함수
  const signIn = () => {
    // axios.post('http://43.201.82.64:8080/members/login',{email: signInEmail,password: signInPassword,})
    axios({
      method: 'post',
      url: 'http://k7d105.p.ssafy.io:8080/members/login',                                       
      headers: {
        'Content-Type': 'application/json',
        // withCredentials: true
      },
      data: {
        email: signInEmail,
        password: signInPassword,
      },
      
    })
      .then(res => {
        if(res.data === true){
          sessionStorage.setItem('accessToken', res.headers.authorization)
          navigate('/main')
        }
        else{
          alert('존재하지 않는 아이디 이거나 틀린 비밀번호입니다')
        }
      })
      .catch(error => {
        alert('존재하지 않는 아이디 이거나 틀린 비밀번호입니다')
      })

  }


  //이메일 중복 체크
  const checkDuplicatedEmail = () => {
    
    if (signUpEmail === '') {
      alert('이메일을 입력해주세요');
      return
    }

    axios({
      method: 'get',
      url: 'http://k7d105.p.ssafy.io:8080/members/check-email',
      params:{
        email:signUpEmail
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(r => {
        if (r.data === true) {
          setIsDuplicated(true);
          alert('이미 존재하는 이메일입니다');
        }
        else {  
          setIsDuplicated(false);
        }
      })
      .catch(err => {
      })

  }

  // form 체인지를 위한 코드
  const changeForm = () => {
    $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
    setSignInEmail('');
    setSignInPassword('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpPasswordCheck('')
  }

  const stopEvent = (e) => {
    e.preventDefault();
    return false;
  }




  return (
    <div className="landing__bg">
      {/* 회원가입 */}
      <div className="login-page">
        <div className="form">
          <form className="register-form" onSubmit={stopEvent}>


            <input type="text" style={{margin:'0 0 0 0'}} placeholder="email address" value={signUpEmail}
              onChange={(e) => { setSignUpEmail(e.target.value) }} onBlur={checkDuplicatedEmail} />
            {isDuplicated === null ? <></> : <InfoMsg check={isDuplicated} />}



            <input type="password" style={{margin:'15px 0 15px 0'}} placeholder="password" value={signUpPassword}
              onChange={(e) => { setSignUpPassword(e.target.value) }} />
            <input type="password" placeholder="password check" value={signUpPasswordCheck}
              onChange={(e) => { setSignUpPasswordCheck(e.target.value) }} />
            <button onClick={signup}>create</button>
            <p className="message">아이디가 있으신가요? &nbsp;&nbsp;&nbsp;<a onClick={changeForm} href="#">로그인</a></p>
          </form>




          {/* 로그인 */}
          <form className="login-form" onSubmit={stopEvent}>
            <input type="text" placeholder="username" value={signInEmail}
              onChange={(e) => { setSignInEmail(e.target.value) }} />
            <input type="password" placeholder="password" value={signInPassword}
              onChange={(e) => { setSignInPassword(e.target.value) }} />
            <button onClick={signIn}>login</button>
            <p className="message">아이디가 없으신가요?&nbsp;&nbsp;&nbsp;<a onClick={changeForm} href="#">회원가입</a></p>
            <p className="message">비밀번호가 기억나지 않으신가요?&nbsp;&nbsp;&nbsp; <a onClick={goFindPassword}>비밀번호 찾기</a></p>
          </form>







        </div>
      </div>




    </div>
  )
}

export default Home