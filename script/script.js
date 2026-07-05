// عناصر HTML
const vote = document.getElementById('vote');
const cover = document.getElementById('cover');
const layer = document.getElementById('layer');
const er = document.getElementById('error');
const one = document.getElementById('one');
const two = document.getElementById('two');
const three = document.getElementById('three');
const four = document.getElementById('four');
const less1 = document.getElementById('less1');
const more1 = document.getElementById('more1');
const more3 = document.getElementById('more3');
const more5 = document.getElementById('more5');
const show1 = document.getElementById('show1');
const show2 = document.getElementById('show2');
const show3 = document.getElementById('show3');
const show4 = document.getElementById('show4');

// توابع کمکی
const storage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const disabled = (el) => el.setAttribute('disabled', true);
const disableAll = () => [less1, more1, more3, more5].forEach(disabled);

// انیمیشن پیشرفت
function animateBar(bar, percent, display) {
  let pos = 0;
  const id = setInterval(() => {
    if (pos >= percent) {
      clearInterval(id);
    } else {
      pos++;
      bar.style.width = `${pos}%`;
    }
  }, 15);
  display.innerText = `${percent}%`;
}

// رأی‌گیری و ثبت
let voted = storage.get('Vote');
let phoneNumber = storage.get('accounts');
let ph = 0;
let user = {};

function submitVote(id) {
  return {
    submit: function () {
      voted.push(id);
      storage.set('Vote', voted);

      const counts = { less1: 0, more1: 0, more3: 0, more5: 0 };
      voted.forEach(v => counts[v]++);
      const total = voted.length;

      disableAll();

      animateBar(one, Math.round((counts.less1 / total) * 100), show1);
      animateBar(two, Math.round((counts.more1 / total) * 100), show2);
      animateBar(three, Math.round((counts.more3 / total) * 100), show3);
      animateBar(four, Math.round((counts.more5 / total) * 100), show4);
    }
  };
}

// مدیریت ورود کاربر
function closeLayer() {
  layer.classList.remove('layer2');
  layer.classList.add('layer3', 'layer');
  cover.classList.remove('l2');
  cover.classList.add('l1');
}

function validatePhone(value) {
  return /^\d{11}$/.test(value);
}

function savePhoneNumber(el) {
  ph = Number(el.value);
  if (!validatePhone(el.value)) {
    pnError.innerText = 'شماره تلفن همراه معتبر نیست.';
    pnError.style.color = 'red';
    pnError.classList.add('ms-4', 'mt-2');
  } else {
    pNumber.innerText = '';
    pnError.innerText = '';
  }
}

function saveFirstname(el) {
  const fn = el.value;
  if (fn === '') {
    fnError.innerText = 'نام خود را وارد کنید.';
    fnError.style.color = 'red';
    fnError.classList.add('ms-4', 'mt-2');
  } else {
    fName.innerText = '';
    fnError.innerText = '';
    user.firstname = fn;
  }
}

function saveLastname(el) {
  const ln = el.value;
  if (ln === '') {
    lnError.innerText = 'نام خانوادگی خود را وارد کنید.';
    lnError.style.color = 'red';
    lnError.classList.add('ms-4', 'mt-2');
  } else {
    lName.innerText = '';
    lnError.innerText = '';
    user.lastname = ln;
  }
}

function handleUserSubmit() {
  if (ph && fName.value && lName.value && pNumber.value) {
    closeLayer();
    if (phoneNumber.includes(ph)) {
      const msg = document.createElement('p');
      msg.innerText = `${user.firstname} عزیز، رأی شما قبلاً ثبت شده است.`;
      msg.style.color = 'red';
      er.appendChild(msg);
      disableAll();
    } else {
      vote.removeEventListener('change', getData);
      vote.addEventListener('change', (e) => {
        const userVote = submitVote(e.target.id);
        userVote.submit();
      });
      phoneNumber.push(ph);
      storage.set('accounts', phoneNumber);
    }
  } else {
    const warning = document.createElement('p');
    warning.innerText = 'لطفا تمامی موارد را کامل کنید.';
    warning.style.color = 'red';
    loginError.appendChild(warning);
    warning.classList.add('ms-4', 'mt-2');
  }
}

// تنظیم فرم ورود
layer.innerHTML = `
  <h5 class="mt-2 ms-1"><button type='button' id="closeBtn"><i class="bi bi-x"></i></button></h5>
  <p class="mt-4 ms-4">برای شرکت در نظرسنجی ابتدا وارد شوید.</p>
  <form>
    <input class="form-control w-50 ms-4 mt-4" type="text" placeholder="نام" onblur="saveFirstname(this)" id="firstname">
    <span id="firsterror"></span>
    <input class="form-control w-50 ms-4 mt-4" type="text" placeholder="نام خانوادگی" onblur="saveLastname(this)" id="lastname">
    <span id="lasterror"></span>
    <input class="form-control w-50 ms-4 mt-4" type="text" placeholder="شماره همراه" onblur="savePhoneNumber(this)" id="phonenumber">
    <span id="phoneerror"></span>
  </form>
  <button type="button" class="btn mt-4 ms-4 btn-color" id="submitBtn"> ثبت اطلاعات </button>
  <div id='loginError'></div>
`;

document.getElementById("closeBtn").addEventListener("click", closeLayer);
document.getElementById("submitBtn").addEventListener("click", handleUserSubmit);
const loginError = document.getElementById('loginError');
const fName = document.getElementById('firstname');
const lName = document.getElementById('lastname');
const pNumber = document.getElementById('phonenumber');
const fnError = document.getElementById('firsterror');
const lnError = document.getElementById('lasterror');
const pnError = document.getElementById('phoneerror');

// وقتی کاربر قبل از ورود بخواد رأی بده
function getData() {
  $('input[name=time]').prop('checked', false);
  cover.classList.remove('l1');
  cover.classList.add('l2');
  layer.classList.remove('layer', 'layer3');
  layer.classList.add('layer2');
  er.innerHTML = '';
}

vote.addEventListener('change', getData);
