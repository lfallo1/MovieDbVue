<template>
  <div>
    <form id="register-form" method="post" role="form" v-if="!hideForm">
      <div class="form-group">
        <input name="username" id="username" tabindex="1" class="form-control" placeholder="Username"
               v-model="user.username">
      </div>
      <div class="form-group">
        <input type="email" name="email" id="email" tabindex="1" class="form-control" placeholder="Email Address"
               v-model="user.email">
      </div>
      <div class="form-group">
        <input :type="passwordInputType" name="password" id="password" tabindex="2" class="form-control"
               placeholder="Password" v-model="user.password">
      </div>
      <div class="form-group">
        <input :type="passwordInputType" name="confirm-password" id="confirm-password" tabindex="2" class="form-control"
               placeholder="Confirm Password" v-model="user.confirmPassword">
      </div>
      <div class="form-group">
        <div class="row">
          <div class="show-hide-password pull-left btn btn-default" @click="showPassword = true" v-if="!showPassword">
            Show password
          </div>
          <div class="show-hide-password pull-left btn btn-default" @click="showPassword = false" v-else>Hide password
          </div>
          <div class="col-sm-6 col-sm-offset-3">
            <input type="submit" name="register-submit" id="register-submit" tabindex="4"
                   class="form-control btn btn-register" value="Register Now" @click.prevent="signup()">
          </div>
        </div>
      </div>
    </form>
    <div v-if="hideForm">
      <div class="form-group">
        <input name="verificationCode" id="verificationCode" tabindex="1" class="form-control"
               placeholder="Enter verification code"
               v-model="verificationCode">
      </div>
      <div class="form-group">
        <div class="row">
          <div class="col-sm-6 col-sm-offset-3">
            <input type="submit" name="register-submit" id="verification-submit" tabindex="4"
                   class="form-control btn btn-register" value="Confirm" @click.prevent="confirm()">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import {CognitoUserPool, CognitoUserAttribute, CognitoUser} from 'amazon-cognito-identity-js';
  import Vue from "vue";

  export default {
    data() {
      return {
        user: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
        showPassword: false,
        awsUser: {},
        hideForm: false,
        verificationCode: ''
      }
    },
    methods: {
      confirm() {
        var poolData = {
          UserPoolId: 'us-east-1_bqd8sS71A', // Your user pool id here
          ClientId: '440m67b7trbh8k5ijnd6ttaes2' // Your client id here
        };
        var userPool = new CognitoUserPool(poolData);
        var userData = {
          Username: this.awsUser.getUsername(),
          Pool: userPool
        };

        var cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmRegistration(this.verificationCode, true, (err, result) => {
          if (err) {
            alert(err);
            return;
          }
          Vue.toasted.success('Thanks, you may now login!', {
            position: 'bottom-right',
            'full-width': true,
            icon: 'check_circle'
          }).goAway(3500);
          this.awsUser = {};
        });
      },
      signup() {
        var poolData = {
          UserPoolId: 'us-east-1_bqd8sS71A', // Your user pool id here
          ClientId: '440m67b7trbh8k5ijnd6ttaes2' // Your client id here
        };
        var userPool = new CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
          Name: 'email',
          Value: this.user.email
        };

        var attributeEmail = new CognitoUserAttribute(dataEmail);
        attributeList.push(attributeEmail);

        userPool.signUp(this.user.username, this.user.password, attributeList, null, (err, result) => {
          if (err) {
            alert(err);
            return;
          }
          Vue.toasted.success('Signed up successfully! Please check your email for the verification code', {
            position: 'bottom-right',
            'full-width': true,
            icon: 'check_circle'
          }).goAway(3500);
          this.awsUser = result.user;
          this.hideForm = true;
        });
      }
    },
    computed: {
      passwordInputType() {
        return this.showPassword ? 'text' : 'password';
      }
    }
  }
</script>

<style>
  .btn-register {
    background-color: #1CB94E;
    outline: none;
    color: #fff;
    font-size: 14px;
    height: auto;
    font-weight: normal;
    padding: 14px 0;
    text-transform: uppercase;
    border-color: #1CB94A;
  }

  .btn-register:hover,
  .btn-register:focus {
    color: #fff;
    background-color: #1CA347;
    border-color: #1CA347;
  }

  .show-hide-password {
    margin-left: 15px;
    margin-right: -15px;
  }
</style>
