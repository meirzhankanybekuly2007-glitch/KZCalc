const RATES = {
  year: 2026,
  MRP: 4325,
  MZP: 85000,
  OPV: 0.10,
  OPVR: 0.035,
  VOSMS: 0.02,
  VOSMS_MAX: 34000,
  OSMS_EMPLOYER: 0.03,
  OSMS_EMPLOYER_MAX: 102000,
  SOCIAL: 0.05,
  VAT: 0.16,
  SIMPLIFIED: 0.04,
  IIN_LOW: 0.10,
  IIN_HIGH: 0.15,
  IIN_THRESHOLD_MRP: 8500,
  BASIC_DEDUCTION_MRP: 30,
  TOO_CIT: 0.20,
  SELF_EMPLOYED_SOCIAL: 0.04
};


const SOURCES = {
  mrp_mzp: {
    title: "МРП и МЗП — 2026",
    url: "https://www.gov.kz/article/17157?lang=ru"
  },
  social: {
    title: "Социальные платежи в Республике Казахстан",
    url: "https://www.gov.kz/memleket/entities/kgd-vko/press/article/details/218907"
  },
  opvr: {
    title: "Обязательные пенсионные взносы работодателя",
    url: "https://www.gov.kz/memleket/entities/kgd-sko/press/article/details/144302"
  },
  osms: {
    title: "ОСМС — ставки и максимальные суммы 2026",
    url: "https://www.gov.kz/memleket/entities/minfin/press/article/details/235407?lang=ru"
  },
  vat: {
    title: "НДС — регистрация и ставка 2026",
    url: "https://www.gov.kz/situations/817/intro?lang=ru"
  },
  simplified: {
    title: "СНР на основе упрощённой декларации",
    url: "https://www.gov.kz/memleket/entities/kgd-vko/press/news/details/1119217"
  },
  simplified_details: {
    title: "Вопросы по налоговому администрированию и СНР",
    url: "https://www.gov.kz/memleket/entities/minfin/documents/details/1030415"
  }
};

const RATE_CARDS = [
  ["МРП", "4 325 ₸", "Месячный расчётный показатель", "mrp_mzp"],
  ["МЗП", "85 000 ₸", "Минимальная заработная плата", "mrp_mzp"],
  ["ОПВ", "10%", "Обязательные пенсионные взносы работника", "social"],
  ["ОПВР", "3,5%", "Обязательные пенсионные взносы работодателя в 2026 году", "opvr"],
  ["ВОСМС", "2%", "Взносы работника; максимум 34 000 ₸ в месяц", "osms"],
  ["ОСМС", "3%", "Отчисления работодателя; максимум 102 000 ₸ в месяц", "osms"],
  ["СО", "5%", "Социальные отчисления работодателя", "social"],
  ["НДС", "16%", "Базовая ставка НДС с 1 января 2026 года", "vat"],
  ["СНР — упрощённая декларация", "4%", "Базовая ставка ИПН/КПН; маслихат может изменить её", "simplified"],
  ["СНР — самозанятые", "4%", "Социальные платежи; ИПН 0% при соблюдении условий режима", "simplified_details"],
  ["КПН ТОО", "20%", "Базовая ставка общеустановленного режима", "simplified_details"],
  ["Базовый вычет", "30 МРП", "129 750 ₸ в месяц при наличии права", "simplified_details"]
];

function sourceLink(key) {
  const s = SOURCES[key];
  return s ? `<a class="source-link" href="${s.url}" target="_blank" rel="noopener">Источник: ${s.title} ↗</a>` : "";
}

function renderRates() {
  const el = document.querySelector(".rates-grid");
  if (!el) return;
  el.innerHTML = RATE_CARDS.map(r =>
    `<div class="rate"><span>${r[0]}</span><b>${r[1]}</b><small>${r[2]}</small>${sourceLink(r[3])}</div>`
  ).join("");
}

const CALCS = [
  ["salary","💵","Финансы","Зарплата на руки","Зарплата до вычетов, ОПВ, ОСМС и ИПН"],
  ["self","🧑‍💻","Финансы","Самозанятый 2026","4% социальных платежей и доход после платежей"],
  ["ip","🧾","Бизнес","ИП — упрощённая декларация","Налог 4% и базовая оценка платежей"],
  ["too","🏢","Бизнес","ТОО — упрощённая декларация","Расчёт КПН/ИПН по ставке СНР 4%"],
  ["tooGeneral","🏛️","Бизнес","ТОО — общеустановленный режим","Оценка КПН по базовой ставке 20%"],
  ["vat","🧮","Бизнес","НДС 16%","Добавить или выделить НДС из суммы"],
  ["social","👥","Бизнес","Социальные платежи работодателя","ОПВР, ОСМС работодателя и социальные отчисления"],
  ["opv","🪙","Пенсия","ОПВ и ОПВР","Пенсионные взносы работника и работодателя"],
  ["credit","🏦","Финансы","Кредит","Ежемесячный платёж, переплата и итоговая сумма"],
  ["deposit","📈","Финансы","Депозит","Доход по депозиту с капитализацией"],
  ["percent","％","Математика","Проценты","Процент от суммы и обратный расчёт"],
  ["discount","🏷️","Математика","Скидка","Цена после скидки и размер скидки"],
  ["fuel","⛽","Авто","Топливо","Стоимость поездки и расход топлива"],
  ["area","📐","Дом","Площадь комнаты","Площадь пола и периметр"],
  ["materials","🪵","Дом","Ламинат","Количество материала с запасом"],
  ["age","🎂","Дата","Возраст","Точный возраст по дате рождения"]
];

const $ = s => document.querySelector(s);
const money = n => Math.round(n).toLocaleString("ru-RU") + " ₸";
const num = id => Number(document.getElementById(id)?.value || 0);

function renderCards(filter="") {
  const q = filter.trim().toLowerCase();
  $("#cards").innerHTML = CALCS.filter(c => c.join(" ").toLowerCase().includes(q)).map(c =>
    `<article class="card" data-id="${c[0]}"><div class="category">${c[2]}</div><div class="icon">${c[1]}</div><h3>${c[3]}</h3><p>${c[4]}</p></article>`
  ).join("");
  document.querySelectorAll(".card").forEach(x => x.onclick = () => openCalc(x.dataset.id));
}

function field(id,label,placeholder="",type="number",value="") {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}"></div>`;
}
function select(id,label,options) {
  return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map(o=>`<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>`;
}
function box(title, desc, form, note="") {
  return `<div class="calc-intro"><div class="eyebrow">KZCALC • 2026</div><h1>${title}</h1><p>${desc}</p></div><div class="calculator-box">${form}${note?`<div class="warning">${note}</div>`:""}</div>`;
}
function result(big, rows) {
  return `<div class="result"><div class="label">Результат</div><div class="big">${big}</div>${rows.map(r=>`<div class="result-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div>`;
}
function show(html, fn) {
  $("#calculatorMount").innerHTML = `<div class="calc-layout"><div>${html}</div><div id="resultCol">${result("—", [["Заполните поля","и нажмите «Рассчитать»"]])}</div></div>`;
  $("#calculator").classList.remove("hidden"); window.scrollTo({top:$("#calculator").offsetTop-70,behavior:"smooth"}); fn();
}

function openCalc(id) {
  location.hash = "calc-" + id;
  const map = {
    salary:()=>show(box("Калькулятор зарплаты","Предварительно оцените сумму «на руки» для наёмного работника.",`${field("gross","Начисленная зарплата","500000","number","500000")}${field("otherDed","Дополнительные налоговые вычеты","0","number","0")}<button class="calculate" id="go">Рассчитать</button>`,"ИПН зависит от налоговых вычетов и годового дохода. Это информационный расчёт, не бухгалтерское заключение."),()=>$("#go").onclick=calcSalary),
    self:()=>show(box("Самозанятый — 2026","Сколько остаётся после социальных платежей по СНР для самозанятых.",`${field("income","Доход за месяц","500000","number","500000")}<button class="calculate" id="go">Рассчитать</button>`,"Для СНР самозанятых: ИПН 0%, социальные платежи 4% от дохода. Условия применения режима и перечень разрешённых видов деятельности нужно проверять отдельно."),()=>$("#go").onclick=calcSelf),
    ip:()=>show(box("ИП — упрощённая декларация","Базовый расчёт налога по СНР на основе упрощённой декларации.",`${field("income","Доход за полугодие","5000000","number","5000000")}${field("rate","Ставка, %","4","number","4")}<button class="calculate" id="go">Рассчитать</button>`,"Базовая ставка — 4%. Маслихат может изменить её до 2% или 6% в зависимости от условий."),()=>$("#go").onclick=calcIP),
    too:()=>show(box("ТОО — упрощённая декларация","Оценка налога ТОО при применении СНР на основе упрощённой декларации.",`${field("income","Доход за полугодие","10000000","number","10000000")}${field("rate","Ставка, %","4","number","4")}${field("payroll","ФОТ за период","2000000","number","2000000")}<button class="calculate" id="go">Рассчитать</button>`,"Для режима действует ставка 4%; при определённых условиях объект может уменьшаться на сумму расходов по доходам работников после превышения годового порога. Этот калькулятор упрощённый."),()=>$("#go").onclick=calcTOO),
    tooGeneral:()=>show(box("ТОО — общеустановленный режим","Базовая оценка КПН для ТОО.",`${field("profit","Налогооблагаемый доход / прибыль","10000000","number","10000000")}${select("citRate","Ставка КПН",[[20,"20% — базовая"],[5,"5% — социальная сфера 2026"],[3,"3% — сельхозпроизводители/аквакультура"],[6,"6% — сельхозкооперативы"],[25,"25% — отдельные категории"]])}<button class="calculate" id="go">Рассчитать</button>`,"Ставка КПН зависит от вида деятельности. Базовая ставка — 20%."),()=>$("#go").onclick=calcTOOGeneral),
    vat:()=>show(box("Калькулятор НДС","Добавьте НДС к цене или выделите НДС из суммы.",`${select("vatMode","Режим",[[1,"Добавить НДС к цене"],[2,"Выделить НДС из суммы с НДС"]])}${field("vatSum","Сумма","100000","number","100000")}${field("vatRate","Ставка НДС, %","16","number","16")}<button class="calculate" id="go">Рассчитать</button>`,"Базовая ставка НДС в 2026 году — 16%; для отдельных операций применяются иные ставки/освобождения."),()=>$("#go").onclick=calcVAT),
    social:()=>show(box("Социальные платежи работодателя","Оцените основные платежи работодателя за одного сотрудника.",`${field("gross","Зарплата сотрудника","500000","number","500000")}${select("opvrEligible","ОПВР",[[1,"Работник подпадает под ОПВР"],[0,"ОПВР не применяется"]])}<button class="calculate" id="go">Рассчитать</button>`,"Расчёт не включает все возможные особенности payroll. ОСМС работодателя ограничен базой 40 МЗП; ОПВР — базой от МЗП до 50 МЗП."),()=>$("#go").onclick=calcSocial),
    opv:()=>show(box("ОПВ и ОПВР — 2026","Показывает пенсионные взносы работника и работодателя.",`${field("gross","Доход","500000","number","500000")}${select("year","Год",[[2026,"2026 — ОПВР 3,5%"],[2027,"2027 — ОПВР 4,5%"],[2028,"2028 — ОПВР 5%"]])}<button class="calculate" id="go">Рассчитать</button>`,"ОПВ работника — 10%; ОПВР в 2026 году — 3,5%."),()=>$("#go").onclick=calcOPV),
    credit:()=>show(box("Кредитный калькулятор","Аннуитетный ежемесячный платёж и переплата.",`${field("principal","Сумма кредита","5000000","number","5000000")}${field("annual","Годовая ставка, %","20","number","20")}${field("months","Срок, месяцев","60","number","60")}<button class="calculate" id="go">Рассчитать</button>`,"Фактическая стоимость кредита может отличаться из-за комиссий, страховки и дополнительных условий банка."),()=>$("#go").onclick=calcCredit),
    deposit:()=>show(box("Калькулятор депозита","Оценка дохода по вкладу с ежемесячной капитализацией.",`${field("dep","Начальная сумма","1000000","number","1000000")}${field("depRate","Годовая ставка, %","15","number","15")}${field("depMonths","Срок, месяцев","12","number","12")}${field("depAdd","Ежемесячное пополнение","0","number","0")}<button class="calculate" id="go">Рассчитать</button>`,"Банковские продукты имеют индивидуальные условия, эффективную ставку и возможные ограничения."),()=>$("#go").onclick=calcDeposit),
    percent:()=>show(box("Калькулятор процентов","Быстрый расчёт процента от суммы.",`${field("pSum","Сумма","100000","number","100000")}${field("pRate","Процент, %","15","number","15")}<button class="calculate" id="go">Рассчитать</button>`),()=>$("#go").onclick=calcPercent),
    discount:()=>show(box("Калькулятор скидки","Узнайте цену после скидки.",`${field("price","Исходная цена","100000","number","100000")}${field("discount","Скидка, %","15","number","15")}<button class="calculate" id="go">Рассчитать</button>`),()=>$("#go").onclick=calcDiscount),
    fuel:()=>show(box("Калькулятор топлива","Стоимость поездки по расстоянию и расходу.",`${field("distance","Расстояние, км","300","number","300")}${field("consumption","Расход, л/100 км","8","number","8")}${field("fuelPrice","Цена топлива, ₸/л","295","number","295")}${field("roundTrip","Обратно?","0","number","0")}<button class="calculate" id="go">Рассчитать</button>`),()=>$("#go").onclick=calcFuel),
    area:()=>show(box("Калькулятор площади комнаты","Площадь пола, периметр и площадь стен.",`${field("length","Длина, м","5","number","5")}${field("width","Ширина, м","4","number","4")}${field("height","Высота стен, м","2.7","number","2.7")}${field("windows","Площадь окон/дверей, м²","2","number","2")}<button class="calculate" id="go">Рассчитать</button>`),()=>$("#go").onclick=calcArea),
    materials:()=>show(box("Калькулятор ламината","Сколько ламината купить с учётом запаса.",`${field("floorArea","Площадь пола, м²","20","number","20")}${field("packArea","Площадь одной упаковки, м²","2.2","number","2.2")}${field("reserve","Запас, %","7","number","7")}<button class="calculate" id="go">Рассчитать</button>`),()=>$("#go").onclick=calcMaterials),
    age:()=>show(box("Калькулятор возраста","Точный возраст по дате рождения.",`${field("birth","Дата рождения","","date")}${field("asof","Рассчитать на дату","","date")}${'<button class="calculate" id="go">Рассчитать</button>'}`),()=>{ $("#asof").value=new Date().toISOString().slice(0,10); $("#go").onclick=calcAge; })
  };
  map[id]?.();
}

function calcSalary(){
  const gross=num("gross"), opv=Math.min(gross,50*RATES.MZP)*RATES.OPV, vosms=Math.min(gross,20*RATES.MZP)*RATES.VOSMS;
  const deduction=RATES.BASIC_DEDUCTION_MRP*RATES.MRP+num("otherDed");
  const annualTaxable=Math.max(0,(gross-opv-vosms-deduction)*12);
  const threshold=RATES.IIN_THRESHOLD_MRP*RATES.MRP;
  const annualIIN=annualTaxable<=threshold?annualTaxable*RATES.IIN_LOW:threshold*RATES.IIN_LOW+(annualTaxable-threshold)*RATES.IIN_HIGH;
  const iin=annualIIN/12, net=Math.max(0,gross-opv-vosms-iin);
  $("#resultCol").innerHTML=result(money(net),[["ОПВ (10%)",money(opv)],["ВОСМС (2%, максимум 34 000 ₸)",money(vosms)],["ИПН (предварительно)",money(iin)],["Базовый вычет",money(deduction-num("otherDed"))]]);
}
function calcSelf(){const income=num("income"), total=income*RATES.SELF_EMPLOYED_SOCIAL;$("#resultCol").innerHTML=result(money(income-total),[["Социальные платежи 4%",money(total)],["ОПВ",money(income*.01)],["ОПВР",money(income*.01)],["СО",money(income*.01)],["ОСМС",money(income*.01)],["ИПН",money(0)]]);}
function calcIP(){const income=num("income"), rate=num("rate")/100, tax=income*rate;$("#resultCol").innerHTML=result(money(tax),[["Доход",money(income)],["ИПН/КПН по СНР",money(tax)],["Ставка",rate*100+"%"],["Остаток после налога*",money(income-tax)]]);}
function calcTOO(){const income=num("income"), rate=num("rate")/100, tax=income*rate;$("#resultCol").innerHTML=result(money(tax),[["Доход",money(income)],["ФОТ (введённый)",money(num("payroll"))],["КПН по СНР",money(tax)],["Ставка",rate*100+"%"]]);}
function calcTOOGeneral(){const profit=num("profit"), rate=num("citRate")/100, tax=profit*rate;$("#resultCol").innerHTML=result(money(tax),[["Налогооблагаемый доход",money(profit)],["КПН",money(tax)],["Ставка",rate*100+"%"]]);}
function calcVAT(){const s=num("vatSum"), r=num("vatRate")/100;let vat,total,base;if(num("vatMode")===1){base=s;vat=base*r;total=base+vat}else{total=s;vat=total*r/(1+r);base=total-vat}$("#resultCol").innerHTML=result(money(vat),[["Сумма без НДС",money(base)],["НДС",money(vat)],["Итого с НДС",money(total)]])}
function calcSocial(){const g=num("gross"), opvrBase=Math.min(Math.max(g,RATES.MZP),50*RATES.MZP), opvr=num("opvrEligible")?opvrBase*RATES.OPVR:0, osms=Math.min(g,40*RATES.MZP)*RATES.OSMS_EMPLOYER, so=g*RATES.SOCIAL;$("#resultCol").innerHTML=result(money(opvr+osms+so),[["ОПВР",money(opvr)],["ОСМС работодателя",money(osms)],["Социальные отчисления",money(so)],["Итого сверху к зарплате",money(opvr+osms+so)]])}
function calcOPV(){const g=num("gross"), y=num("year"), rate=y===2026?.035:y===2027?.045:.05, base=Math.min(Math.max(g,RATES.MZP),50*RATES.MZP), opv=Math.min(g,50*RATES.MZP)*.10, opvr=base*rate;$("#resultCol").innerHTML=result(money(opv),[["ОПВ работника",money(opv)],["ОПВР работодателя",money(opvr)],["Сумма обоих",money(opv+opvr)],["Ставка ОПВР",rate*100+"%"]])}
function calcCredit(){const p=num("principal"), r=num("annual")/1200, n=num("months");if(!p||!n){$("#resultCol").innerHTML=result("Введите данные",[]);return}const pay=r? p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1):p/n,total=pay*n;$("#resultCol").innerHTML=result(money(pay),[["Срок",n+" мес."],["Всего выплат",money(total)],["Переплата",money(total-p)]])}
function calcDeposit(){let balance=num("dep"), rate=num("depRate")/100/12, add=num("depAdd"), n=num("depMonths"), invested=balance;for(let i=0;i<n;i++){balance*=1+rate;if(i<n-1){balance+=add;invested+=add}}$("#resultCol").innerHTML=result(money(balance),[["Внесено собственных средств",money(invested)],["Доход",money(balance-invested)],["Месячная ставка (для модели)",(rate*100).toFixed(3)+"%"]])}
function calcPercent(){const s=num("pSum"),r=num("pRate")/100;$("#resultCol").innerHTML=result(money(s*r),[["Исходная сумма",money(s)],["Процент",r*100+"%"]])}
function calcDiscount(){const p=num("price"),d=num("discount")/100,s=p*d;$("#resultCol").innerHTML=result(money(p-s),[["Скидка",money(s)],["Процент скидки",d*100+"%"],["Исходная цена",money(p)]])}
function calcFuel(){const d=num("distance")*(num("roundTrip")?2:1), c=num("consumption"), fp=num("fuelPrice"), liters=d*c/100;$("#resultCol").innerHTML=result(money(liters*fp),[["Расстояние",d+" км"],["Топливо",liters.toFixed(1)+" л"],["Цена за литр",money(fp)],["Расход",c+" л/100 км"]])}
function calcArea(){const l=num("length"),w=num("width"),h=num("height"),open=num("windows"),floor=l*w,per=2*(l+w),walls=Math.max(0,per*h-open);$("#resultCol").innerHTML=result(floor.toFixed(2)+" м²",[["Периметр",per.toFixed(2)+" м"],["Площадь стен",walls.toFixed(2)+" м²"],["Площадь окон/дверей",open.toFixed(2)+" м²"]])}
function calcMaterials(){const a=num("floorArea")*(1+num("reserve")/100),p=num("packArea"),packs=Math.ceil(a/p);$("#resultCol").innerHTML=result(packs+" упаковок",[["Площадь с запасом",a.toFixed(2)+" м²"],["Площадь в упаковке",p.toFixed(2)+" м²"],["Запас",num("reserve")+"%"]])}
function calcAge(){const b=new Date($("#birth").value),d=new Date($("#asof").value);if(isNaN(b)||isNaN(d)||b>d){$("#resultCol").innerHTML=result("Проверьте даты",[]);return}let y=d.getFullYear()-b.getFullYear(),m=d.getMonth()-b.getMonth(),day=d.getDate()-b.getDate();if(day<0){m--;day+=new Date(d.getFullYear(),d.getMonth(),0).getDate()}if(m<0){y--;m+=12}$("#resultCol").innerHTML=result(`${y} лет`,[["Месяцев сверх лет",m],["Дней сверх месяцев",day],["Дата расчёта",d.toLocaleDateString("ru-RU")]])}

function closeCalc(){ $("#calculator").classList.add("hidden"); location.hash="calculators"; }
$("#backBtn").onclick=closeCalc;
$("#search").oninput=e=>renderCards(e.target.value);
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(h.startsWith("calc-"))openCalc(h.slice(5));});
renderCards();
renderRates();
if(location.hash.startsWith("#calc-"))openCalc(location.hash.slice(6));
