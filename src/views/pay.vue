<template>
  <v-container fluid>
    <div v-if="showDOB">
      <v-row align="center" justify="center">
        <v-col id="toImage" cols="12" sm="8" md="6">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
            @submit.prevent="checkDob"
          >
            <div align="center" justify="center">
              <img src="../assets/cathay-logo.jpg" class="logores" />
            </div>
            <p>
              กรุณากรอกรหัสในการเปิด E-Payment Form เป็นข้อมูลวัน/เดือน/ปีเกิด
              แบบปี พ.ศ. จำนวน 8 หลัก เช่นวันเกิด 1 มกราคม 2530 รหัสผ่านคือ
              01012530 เพื่อยืนยันตัวตนของท่านอีกครั้ง
            </p>
            <v-text-field
              v-model="dob"
              solo
              placeholder="วัน-เดือน-ปี"
              :rules="dobRules"
              required
              maxlength="8"
            ></v-text-field>

            <v-btn block color="primary" @click="checkDob">Confirm</v-btn>
            <p class="notfoundDOB" :class="showNotFound ? 'active' : ''">
              กรุณากรอกรหัสผ่านเป็นข้อมูลวันเกิดให้ถูกต้องครบถ้วน ดังตัวอย่าง
            </p>
          </v-form>
        </v-col>
      </v-row>
    </div>

    <div v-if="showPay">
      <v-row align="center" justify="center">
        <v-col id="toImage" cols="12" md="9" lg="6" xl="4">
          <v-row align="center" justify="center">
            <img src="../assets/cathay-logo.jpg" class="logores" />
          </v-row>
          <v-row align="center" class="pb-4" justify="center">
            <img src="../assets/bank.png" class="logores" />
          </v-row>
          <v-row align="center" justify="center" class="headerA">
            สินเชื่อเช่าซื้อรถจักรยานยนต์
          </v-row>
          <v-row align="center" justify="center" class="font-Ref1"
            >เลขอ้างอิง (Ref1) : {{ userData.ref1 }}
          </v-row>
          <v-row align="center" justify="center" class="font-Ref2 pb-3"
            >เลขอ้างอิง (Ref2) : {{ userData.ref2 }}</v-row
          >
          <v-row align="center" justify="center">
            <v-col align="center" justify="center" class="bar">
              <img id="barcode" class="responsive pa-0 ma-0" />
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col align="center" justify="center" class="qr">
              <canvas id="qr" class="responsiveqr"></canvas>
            </v-col>
          </v-row>
          <v-row class="pa-0"
            ><v-col class="text-center pa-0 font-data">{{
              userData.cust_name
            }}</v-col></v-row
          >
          <!-- <v-row class="pa-0"><v-col class="text-center pb-2 pt-0 font-data ">ค่างวด (บาท) : {{new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(userData.installment).replace('฿', '') }}</v-col></v-row> -->
          <v-row align="center" justify="center">
            <v-col class="text-center" cols="12" sm="8" md="12">
              สอบถามข้อมูลเพิ่มเติม ติดต่อศูนย์บริการลูกค้า <br />
              โทร <a href="tel:021614519">02-161-4519</a> เวลา 8:30 – 17:30 น.
              <br />วันจันทร์ ถึงวันศุกร์ (ยกเว้นวันหยุดนักขัตฤกษ์)
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="bar"
        ><v-col class="text-center bar"
          ><v-btn color="success" class="bar" large @click="saveImage"
            >SAVE</v-btn
          ></v-col
        ></v-row
      >
    </div>
  </v-container>
</template>
<script>
import qrCode from "qrious";
import htmlToImage from "html-to-image";
import moment from "moment";
import jsbarcode from "jsbarcode";
export default {
  data() {
    return {
      valid: true,
      dob: "",
      userData: {},
      dobRules: [
        (v) =>
          !!v ||
          "กรุณากรอกรหัสผ่านเป็นข้อมูลวันเกิดให้ถูกต้องครบถ้วน ดังตัวอย่าง",
      ],
      showDOB: true,
      showPay: false,
      showNotFound: false,
    };
  },

  created() {
    if (this.showDOB) {
      this.userData = this.$store.state.response.info;
    } else {
      this.$router.push("/end");
    }
  },
  updated() {
    if (this.showPay) {
      this.axios
        .post(
          `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/visited`,
          {
            userID: this.userData.id,
          }
        )
        .catch((error) => console.log(error));
      jsbarcode(
        "#barcode",
        `${this.userData.prefix}${this.userData.tax_id}${this.userData.suffix}
${this.userData.ref1}
${this.userData.ref2}
${this.userData.amount}`,
        { fontSize: 12 }
      );
      new qrCode({
        element: document.querySelector("canvas"),
        value: `${this.userData.prefix}${this.userData.tax_id}${this.userData.suffix}
${this.userData.ref1}
${this.userData.ref2}
${this.userData.amount}`,
        level: "M",
        size: 200,
      });
    }
  },

  methods: {
    checkDob() {
      if (this.$refs.form.validate()) {
        if (this.userData) {
          let day = parseInt(this.dob.substring(0, 2));
          let month = this.dob.substring(2, 4) - 1;
          let year = parseInt(this.dob.substring(4)) - 543;
          let checkDob = moment()
            .year(year)
            .month(`${month}`)
            .date(day)
            .format("YYYY-MM-DD");
          let dobUser = moment(this.userData.birthdate).format("YYYY-MM-DD");
          if (dobUser === checkDob) {
            this.showDOB = false;
            this.showPay = true;
          } else {
            this.showNotFound = true;
          }
        } else {
          this.$router.push("/end");
        }
      }
    },
    saveImage() {
      const imgDownload = document.getElementById("toImage");
      let date = moment().format("DDMM_HHmmss");
      htmlToImage
        .toJpeg(imgDownload, {
          backgroundColor: "#FFFFFF",
          style: { visibility: "visible" },
        })
        .then(function (dataUrl) {
          let link = document.createElement("a");
          link.download = `cathay-leasing-payment-${date}.jpeg`;
          link.href = dataUrl;
          link.click();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.bar {
  padding: 0;
  margin: 0;
}
.qr {
  padding: 0;
  margin: 0;
}
.responsive {
  width: 90%;
  height: auto;
}
.responsiveqr {
  width: 45%;
  height: auto;
}
.logores {
  width: 50%;
  height: auto;
}
.text-title {
  font-size: 14px;
  color: #23282c;
  font-weight: bold;
}
::v-deep .v-messages__message {
  padding-top: 5px !important;
  padding-bottom: 5px !important;
}
.notfoundDOB {
  padding-top: 24px;
  color: red;
  display: none;
  &.active {
    display: block;
  }
}
.headerA {
  font-size: 22px;
  font-weight: bold;
}
.footext {
  font-size: 17px;
  font-weight: bold;
}
.font-data {
  font-size: 17px;
}
.font-Ref1 {
  font-size: 16px;
}
.font-Ref2 {
  font-size: 16px;
}
@media only screen and (min-device-width: 1024px) and (max-device-width: 1366px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait) {
  .logores {
    width: 50%;
    height: auto;
  }
  .responsive {
    width: 100%;
    height: auto;
  }
  .responsiveqr {
    width: 40%;
    height: auto;
  }
  .headerA {
    font-size: 25px;
    font-weight: bold;
  }
  .footext {
    font-size: 20px;
    font-weight: bold;
  }
  .font-data {
    font-size: 20px;
  }
  .font-Ref1 {
    font-size: 19px;
  }
  .font-Ref2 {
    font-size: 19px;
  }
}
@media screen and (max-width: 1920px) {
  .logores {
    width: 50%;
    height: auto;
  }
  .responsive {
    width: 90%;
    height: auto;
  }
  .responsiveqr {
    width: 40%;
    height: auto;
  }
  .headerA {
    font-size: 25px;
    font-weight: bold;
  }
  .footext {
    font-size: 20px;
    font-weight: bold;
  }
  .font-data {
    font-size: 20px;
  }
  .font-Ref1 {
    font-size: 19px;
  }
  .font-Ref2 {
    font-size: 19px;
  }
}
</style>
