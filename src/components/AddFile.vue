<template>
  <div>
    <b-dropdown :disabled="disabled" v-if="$auth.check()" variant="primary" title="Add file">
      <template v-slot:button-content>
        <font-awesome-icon icon="file" />
      </template>
      <b-dropdown-item v-b-modal.add-procedure-modal>Procedure</b-dropdown-item>
    </b-dropdown>
    <b-modal
      id="add-procedure-modal"
      ref="addProcedureModal"
      title="Add procedure"
      @shown="clear('xpro')"
      v-bind:hide-footer="true"
    >
      <b-alert :variant="alertColor" show>{{ title }}</b-alert>

      <b-form @submit="onSubmit" v-if="show">
        <b-form-group label="System code" label-for="systemCode">
          <b-input-group>
            <b-form-select
              id="systemCode"
              v-model="data.systemCode"
              required
              v-bind:options="optionsSystemCode"
            >
              <template slot="first">
                <option v-bind:value="'XX'" disabled>Select system</option>
              </template>
            </b-form-select>
            <b-form-select
              id="subSystemCode"
              v-model="data.subSystemCode"
              required
              :disabled="!optionsSubSystemCode"
              v-bind:options="optionsSubSystemCode"
            >
              <template slot="first">
                <option v-bind:value="'XX'" disabled>Select subsystem</option>
              </template>
            </b-form-select>
          </b-input-group>
        </b-form-group>

        <b-form-group label="Disassembly code" label-for="disassyCode">
          <b-input-group>
            <b-form-input
              id="disassyCode"
              title="Disassembly code"
              type="number"
              min="0"
              max="99"
              v-model="data.disassyCode"
              required
            />
            <b-form-input
              id="disassyCodeVariant"
              title="Disassembly code variant"
              type="number"
              min="0"
              max="9"
              v-model="data.disassyCodeVariant"
              required
            />
          </b-input-group>
        </b-form-group>

        <b-form-group label="Information code" label-for="infoCode">
          <b-input-group>
            <b-form-select
              id="infoChapterCode"
              v-model="infoChapterCode"
              required
              v-bind:options="optionsInfoChapterCode"
            >
              <template slot="first">
                <option v-bind:value="''" disabled>Select type of information</option>
              </template>
            </b-form-select>
            <b-form-select
              id="infoCode"
              v-model="data.infoCode"
              required
              :disabled="!optionsInfoCode"
              v-bind:options="optionsInfoCode"
            >
              <template slot="first">
                <option v-bind:value="'XXX'" disabled>Select information code</option>
              </template>
            </b-form-select>
          </b-input-group>
        </b-form-group>

        <b-form-group label="Item location" label-for="itemLocationCode">
          <b-form-select id="itemLocationCode" v-model="data.itemLocationCode" required>
            <b-form-select-option value="Z" disabled>Select item location</b-form-select-option>
            <b-form-select-option value="A">A-Items installed on the aircraft</b-form-select-option>
            <b-form-select-option
              value="B"
            >B-Items installed on a major assembly removed from the aircraft</b-form-select-option>
            <b-form-select-option value="C">C-Items on the bench</b-form-select-option>
            <b-form-select-option value="D">D-Severals locations</b-form-select-option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="Technical Name" label-for="techName">
          <b-form-input
            id="techName"
            type="text"
            v-model="data.techName"
            required
            placeholder="Ex : Outer cell, main landing gear actuator..."
          />
        </b-form-group>

        <b-form-group label="Information Name" label-for="infoName">
          <b-form-input
            id="infoName"
            type="text"
            v-model="data.infoName"
            placeholder="Ex : Removal, test..."
          />
        </b-form-group>

        <b-button :disabled="!completeTitle" type="submit" variant="primary">Submit</b-button>
        <b-button
          type="button"
          class="ml-2"
          variant="warning"
          @click.prevent="onCancelProcedure"
        >Cancel</b-button>
        <b-alert v-show="error" variant="warning" show>{{ error }}</b-alert>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import { systemCode, subSystemCode } from "@/assets/js/SystemCode.js";
import { infoChapterCode, infoCode } from "@/assets/js/InfoCode.js";

export default {
  name: "AddFile",
  data() {
    return {
      data: {
        type: "",
        techName: "",
        infoName: "",
        systemDiffCode: "A",
        systemCode: "XX",
        subSystemCode: "XX",
        subSubSystemCode: "0",
        assyCode: "00",
        disassyCode: 0,
        disassyCodeVariant: 0,
        infoCode: "XXX",
        infoCodeVariant: "A",
        itemLocationCode: "Z"
      },
      infoChapterCode: "",
      optionsInfoChapterCode: infoChapterCode,
      optionsSystemCode: systemCode,
      error: null,
      show: true
    };
  },
  props: { disabled: Boolean, model: String, plane: String, files: Array },
  computed: {
    optionsInfoCode: function() {
      if (this.infoChapterCode == "") return null;
      return infoCode[this.infoChapterCode];
    },
    optionsSubSystemCode: function() {
      if (this.data.systemCode == -1) return null;
      return subSystemCode[this.data.systemCode];
    },
    alertColor: function() {
      if (this.completeTitle) {
        return "success";
      } else {
        return "danger";
      }
    },
    completeTitle: function() {
      if (this.data.systemCode == "XX") return false;
      if (this.data.subSystemCode == "XX") return false;
      if (this.data.infoCode == "XXX") return false;
      if (this.data.itemLocationCode == "Z") return false;
      if (this.fileExist(this.title)) return false;
      return true;
    },
    title: function() {
      const title =
        this.model.toUpperCase() +
        "-" +
        this.data.systemDiffCode +
        "-" +
        this.data.systemCode +
        "-" +
        this.data.subSystemCode +
        "-" +
        this.data.assyCode +
        "-" +
        this.codeToStr(this.data.disassyCode) +
        "-" +
        this.codeToStr(this.data.disassyCodeVariant, 1) +
        "-" +
        this.data.infoCode +
        this.data.infoCodeVariant +
        "-" +
        this.data.itemLocationCode +
        ".xml";
      return title;
    }
  },
  methods: {
    codeToStr(code, digit = 2) {
      if (code.length > digit) {
        return "";
      }
      if (code < 0) {
        return "X".repeat(digit);
      } else {
        let maskCode = "0".repeat(digit);
        let strCode = code.toString();
        return maskCode.slice(0, digit - strCode.length) + strCode;
      }
    },
    fileExist(filename) {
      for (let file in this.files) {
        if (filename == file["filename"]) {
          return true;
        }
      }
      return false;
    },
    onCancelProcedure() {
      this.$refs.addProcedureModal.hide();
    },
    clear(type) {
      this.data.type = type;
      this.data.systemCode = "XX";
      this.data.subSystemCode = "XX";
      this.data.assyCode = "00";
      this.data.disassyCode = 0;
      this.data.disassyCodeVariant = 0;
      this.data.infoCode = "XXX";
      this.data.itemLocationCode = "Z";
      this.infoChapterCode = "";
    },
    onSubmit(evt) {
      evt.preventDefault();
      Vue.axios
        .post(
          "/docs/" +
            this.$route.params.model +
            "/references/" +
            this.$route.params.reference +
            "/files",
          this.data
        )
        .then(resp => {
          this.$nextTick(() => {
            this.$emit("add-file", resp["data"]["filename"]);
            this.$refs.addProcedureModal.hide();
          });
        })
        .catch(err => {
          this.error = err.response.data.error;
        });
    }
  }
};
</script>
