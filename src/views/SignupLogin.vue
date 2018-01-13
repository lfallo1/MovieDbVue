<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <div class="panel panel-login">
          <div class="panel-heading">
            <div class="row signup-login-panel-heading">
              <div class="col-xs-6">
                <a :class="loginView ? 'active' : ''" id="login-form-link" @click="loginView = true">Login</a>
              </div>
              <div class="col-xs-6">
                <a :class="!loginView ? 'active' : ''" id="register-form-link" @click="loginView = false">Register</a>
              </div>
            </div>
            <hr>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-lg-12">
                <keep-alive>
                  <component v-bind:is="currentView"></component>
                </keep-alive>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

  import {mapState} from 'vuex';
  import {router} from '../main.js';
  import LoginForm from '../components/Login/LoginForm.vue';
  import SignupForm from '../components/Login/SignupForm.vue';

  export default {
    components: {
      'app-login-form': LoginForm,
      'app-signup-form': SignupForm
    },
    data() {
      return {
        loginView: true
      }
    },
    computed: {
      currentView() {
        return this.loginView ? 'app-login-form' : 'app-signup-form';
      },

    }
  }
</script>
<style scoped>
  body {
    padding-top: 90px;
  }

  .panel-login {
    border-color: #ccc;
    -webkit-box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
    box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.2);
  }

  .panel-login > .panel-heading {
    color: #00415d;
    background-color: #fff;
    border-color: #fff;
    text-align: center;
  }

  .panel-login > .panel-heading a {
    text-decoration: none;
    color: #666;
    font-weight: bold;
    font-size: 15px;
    -webkit-transition: all 0.1s linear;
    -moz-transition: all 0.1s linear;
    transition: all 0.1s linear;
  }

  .panel-login > .panel-heading a.active {
    color: #029f5b;
    font-size: 18px;
  }

  .panel-login > .panel-heading hr {
    margin-top: 10px;
    margin-bottom: 0px;
    clear: both;
    border: 0;
    height: 1px;
    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    background-image: -ms-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
  }

  .panel-login input[type="text"], .panel-login input[type="email"], .panel-login input[type="password"] {
    height: 45px;
    border: 1px solid #ddd;
    font-size: 16px;
    -webkit-transition: all 0.1s linear;
    -moz-transition: all 0.1s linear;
    transition: all 0.1s linear;
  }

  .panel-login input:hover,
  .panel-login input:focus {
    outline: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    border-color: #ccc;
  }

  .signup-login-panel-heading a:hover {
    cursor: pointer;
    text-decoration: underline !important;
  }
</style>
