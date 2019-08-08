<template>
  <div>
    <b-dropdown
      v-if="$auth.check()"
      right
      variant="success"
      @shown="clear(false)"
      ref="dropdownlogin"
    >
      <template slot="button-content">
        <font-awesome-icon icon="user" />
      </template>
      <b-dropdown-text>
        {{ $auth.user().username }}
        <b-button class="mx-1" variant="warning" href="#" @click="logout">
          <font-awesome-icon icon="sign-out-alt" />
        </b-button>
      </b-dropdown-text>
      <slot name="login" />
    </b-dropdown>

    <b-dropdown
      v-if="!$auth.check()"
      right
      variant="primary"
      @shown="clear(true)"
      ref="dropdownlogout"
    >
      <template slot="button-content">
        <font-awesome-icon icon="sign-in-alt" />
      </template>
      <b-dropdown-form @submit="onSubmit" v-if="show">
        <b-form-group label="Username" label-for="username">
          <b-form-input
            id="username"
            type="text"
            ref="focusthis"
            v-model="data.body.username"
            required
            autofocus
            placeholder="Enter username"
          />
        </b-form-group>
        <b-form-group label="Password" label-for="password">
          <b-form-input
            id="password"
            type="password"
            v-model="data.body.password"
            required
            placeholder="Enter password"
          />
        </b-form-group>
        <b-button type="submit" variant="primary">Sign in</b-button>
        <b-alert v-show="error" variant="warning" show>{{ error }}</b-alert>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      context: "login context",
      data: {
        body: {
          username: "",
          password: ""
        },
        rememberMe: false,
        fetchUser: true
      },
      error: null,
      show: true
    };
  },
  methods: {
    clear(autofocus) {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
        this.$nextTick(() => {
          if (autofocus) this.$refs.focusthis.focus();
          this.$emit("clear");
        });
      });
      this.data.body.username = "";
      this.data.body.password = "";
      this.error = null;
    },
    logout() {
      this.$refs.dropdownlogin.hide(true);
      this.$auth.logout({
        makeRequest: true,
        data: {},
        redirect: false
      });
    },
    closeDropDown() {
      this.$refs.dropdownlogin.hide(true);
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$auth.login({
        data: this.data.body, // Axios
        rememberMe: this.data.rememberMe,
        fetchUser: this.data.fetchUser,
        redirect: false,
        success: function() {
          this.$refs.dropdownlogout.hide(true);
          this.data.body.password = "";
        },
        error: function(err) {
          this.error = err.response.data.error;
        }
      });
    }
  }
};
</script>
