import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gdvhqjtowwlhmkkdtsut.supabase.co",
  "sb_publishable_tCl4jnukTcXRtpSv5ihMzg_IMeYwwHh"
);

async function main() {
  // Step 1: Check if table exists
  console.log("🔍 检查数据库连接...\n");
  const { error: checkError } = await supabase
    .from("projects")
    .select("id")
    .limit(1);

  if (checkError && (checkError.message.includes("does not exist") || checkError.message.includes("schema cache"))) {
    console.log("⚠️  数据库还是空的，需要先建表。\n");
    console.log("请按以下步骤操作（只需做一次）：\n");
    console.log("  1. 打开 https://supabase.com/dashboard/project/gdvhqjtowwlhmkkdtsut/sql/new");
    console.log("  2. 复制粘贴下面这整段 SQL：\n");
    console.log("  ─────────────────────────────────────\n");
    console.log(`CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  stage TEXT NOT NULL,
  next_action TEXT NOT NULL DEFAULT '',
  health TEXT NOT NULL DEFAULT 'green' CHECK (health IN ('green', 'yellow', 'red')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();`);
    console.log("\n  ─────────────────────────────────────");
    console.log("  3. 点击右下角 Run 按钮执行\n");
    console.log("  ✅ 执行成功后，重新运行: node setup.mjs\n");
    return;
  }

  if (checkError) {
    console.error("❌ 连接失败:", checkError.message);
    return;
  }

  console.log("✅ 数据库连接正常\n");

  // Step 2: Insert seed data
  console.log("📥 导入 5 条项目数据...\n");

  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("❌ 清理旧数据失败:", deleteError.message);
    return;
  }

  const seedData = [
    {
      name: "快驴（无锡）",
      stage: "线索",
      next_action: "输出夜间（22点-7点）无人车配送费用方案，并寻找快驴总部决策人洽谈合作",
      health: "yellow",
      summary: "",
      notes: `【客户背景】
快驴：美团旗下B2B食材配送平台。配送模式：无锡总仓（分拣配送在一起）→末端商户门店。货物包括外部供货商的货 + 自营库内货，全部集中到无锡总仓，各区域司机集中在总仓作业，分拣、装车、配送到商户门店。

【当前情况】
已与快驴无锡负责人建立联系。该负责人只有执行权，没有决策权，明确表示需要找总部负责人谈合作机会。
对方建议：可以先从三轮车模式上使用无人车去试点，但需要我们出方案。
新石器曾跟他们沟通过：夜间30元/台车（22点-7点）。

配送时间：凌晨4点~上午8-9点（司机23点多到，参与分拣工作）。
配送范围：15KM以内（商户），装货时间22点后。
三轮车现状：现在每天只能跑一次。

成本结构：
- 三轮车：460元/月（租用），可装250-300件货
- 司机：8000-9000元/月
- 单件成本：约6毛

快驴车辆成本参考：
- 快驴提供车辆，租金3000-3500元不等（10方车）
- 平均一趟运费400元左右，500多件，单件0.8元，客户34家
- 带车司机按趟月结，计件计提（点位费、件数、里程、货值提成综合），单件价0.8-0.9元，综合400-500元/天
- 出勤最低保护：280元/天
- 三轮车可自带可租公司，仓库附近10公里内，多批次复跑，最优3趟，实际基本跑1趟，总计200-300件
- 前期有运费保护（阶梯式分多档位，300件保底200元）

【机会点】
- 三轮车模式适合作为无人车试点切入点（多批次复跑、10公里内）
- 快驴无锡负责人有意愿推动试点
- 已有竞品（新石器）报价参考：夜间30元/台车

【风险/卡点】
- 当前联系人无决策权，需另寻总部KP
- 每天实际只能跑1趟，与最优3趟有差距
- 需输出有竞争力的夜间费用方案

【下一步】
输出夜间（22点-7点）无人车配送费用方案，同时寻找快驴总部决策人洽谈`,
    },
    {
      name: "无锡天惠超市",
      stage: "线索",
      next_action: "评估粮油副食日配方案可行性，输出试用方案（含2个免费试用账号）",
      health: "yellow",
      summary: "",
      notes: `【客户背景】
无锡天惠超市股份有限公司，本地连锁超市。

【当前情况】
已了解客户配送需求：
① 粮油副食订单配送（白天配送）：送30几个商超，点对点模式 —— 客户认为可以先试验。
② 蔬菜水果冷链配送（夜间配送）：暂时无法满足（需冷链车）。

冷链车成本参考（客户提供）：
- 8年40万/辆，年均5万/辆
- 8次/天
- 司机12万/年
- 油费150元/天（预估）

客户明确表示：如果第二个（冷链）暂时不能满足，先看第一个（粮油副食日配）能不能做。

【机会点】
- 客户主动提出可以先试粮油副食日配
- 需求明确：30+商超点对点日配
- 可先落地再扩展至冷链

【风险/卡点】
- 冷链需求暂无法满足，可能影响长期合作深度
- 需评估日配运力与成本是否匹配
- 未提及现有配送成本，需进一步了解

【下一步】
评估粮油副食日配方案可行性，输出包含2个免费试用账号的试用方案`,
    },
    {
      name: "百果园（佛山）",
      stage: "线索",
      next_action: "输出装卸货/不装卸货两版报价方案，进一步了解单件配送成本",
      health: "yellow",
      summary: "",
      notes: `【客户背景】
百果园，全国连锁水果零售品牌。佛山区域仓到店配送。

【当前情况】
配送模式：
- 仓→店，运输距离30km左右
- 一装多卸，需装卸货扫描（司机需扫描单子确认装货、卸货）
- 使用自有司机，负责装卸货 + 扫描单子
- 现有车辆：厢货4.2米
- 需回收货篮

运输时段：22:00~次日7:00前
门店数量：100家左右
日均单量：50~60单

运力计划：佛山要扩展一个车队，现在自己有2辆无人车，如果能和我们合作就不扩展自有车队了。

【机会点】
- 客户正在扩展运力，有明确合作意愿
- 已有2辆无人车使用经验，对无人车接受度高
- 如果能合作，客户不再扩展自有车队（直接转化）
- 100家门店、日均50-60单，体量可观

【风险/卡点】
- 需要装卸货操作（扫描确认 + 回收货篮）
- 单件成本待进一步了解
- 需提供装卸货/不装卸货两版报价
- 夜间作业时段（22:00-7:00）

【下一步】
输出装卸货与不装卸货两个版本的报价方案，并进一步了解客户单件配送成本`,
    },
    {
      name: "多多买菜（江门新会）",
      stage: "需求确认",
      next_action: "输出具体价格及装卸货方案，待一装多卸功能上线后尝试一条路线",
      health: "yellow",
      summary: "",
      notes: `【客户背景】
多多买菜新会分拣点，三方外包模式。

【当前情况】
已确认KP（是），已添加微信。

现有配送方式：
- 21条路线，21个司机（9辆中面 + 11辆3.8箱车）
- 一辆车一天一条路线，一条线路约30个站点、约30公里
- 配送时间：早5:00~早11:00
- 配送成本：一个站点2元 + 1.8毛/件，一辆车平均400件，单车总成本约150元
- 单件均价约3.6毛（站点费+计件提成）
- 配送距离：30公里内

无人车消化要求：
- 仓→店（下沉取货站点）
- 时效：早上11点前需配送完，特殊情况可报备至下午4点
- 装卸：一装多卸（30卸），装货需培训按要求分拣装车，卸货需拍照上传多多平台（门头+货物）留痕，需回收货篮 + 货损

合作条件：
- 无人车30公里 + 30个点位费 + 装卸费用 需低于120元/条线

【机会点】
- KP已确认，决策路径清晰
- 21条路线体量大，试点成功后可快速扩展
- 现有单线成本150元，目标120元，有30元降本空间

【风险/卡点】
- 一装多卸（30卸）功能尚未上线
- 装卸要求复杂：培训装货 + 拍照上传 + 回收货篮 + 货损
- 价格敏感：需低于120元/条线才可推进
- 需输出完整装卸货方案

【下一步】
输出具体价格及装卸货方案。待一装多卸功能上线后，尝试一条路线验证，解决卡点后可扩大合作`,
    },
    {
      name: "菜大王（江门蓬江）",
      stage: "线索",
      next_action: "输出具体配送方案，约老板白天时间洽谈",
      health: "yellow",
      summary: "",
      notes: `【客户背景】
菜大王蓬江分拣点，外包独立运营。广东省内共23个仓，有自营平台及小程序下单。

【当前情况】
已与仓库负责人建立联系（非KP），仓库管理员意向高，已添加微信。需向老板申请，看老板意愿。

现有配送方式：
- 32条路线
- 自营司机3个，剩余全是兼职及车队司机
- 一条线路10个点左右，基本使用3.8米和4.2米车型
- 配送时间：早4:30~早8:30
- 配送成本：一个站点25元，一辆车10个点，总成本约250元，司机自带车
- 配送距离：30公里内

无人车消化要求：
- 仓→合作单位（工厂、食堂、酒楼）
- 时效：早上8:30前需配送完，超时需罚款
- 装卸：一装多卸（10卸），需司机装货，卸货需拍照上传司机管理系统（门头+货物）留痕，需回收货篮 + 货损

合作条件：
- 无人车30公里 + 10个点位费 + 装卸费用 需低于100元/条线
- 现有车辆送10个方左右，转换无人车保底需2辆的成本

【机会点】
- 32条路线体量可观
- 仓库负责人意向高，内部有人推动
- 10个点位的一装多卸相比30个点位更易实现

【风险/卡点】
- 当前联系人非KP，需争取老板同意
- 超时罚款机制，时效压力大（8:30前）
- 成本敏感：需低于100元/条线，且需2辆无人车替代1辆现有车
- 装卸要求：装货 + 拍照上传 + 回收货篮 + 货损

【下一步】
输出具体配送方案（含价格及装卸货方案），由仓库负责人约老板白天时间洽谈`,
    },
  ];

  const { error: insertError } = await supabase.from("projects").insert(seedData).select("id");

  if (insertError) {
    console.error("❌ 导入失败:", insertError.message);
    return;
  }

  console.log(`✅ 成功导入 ${seedData.length} 条项目数据\n`);

  // Verify
  const { data, error: verifyError } = await supabase
    .from("projects")
    .select("name, stage, health");

  if (verifyError) {
    console.error("⚠️ 验证失败:", verifyError.message);
  } else {
    console.log("📊 看板数据一览：\n");
    data.forEach((p) => {
      const h = { green: "🟢", yellow: "🟡", red: "🔴" }[p.health];
      console.log(`  ${h}  ${p.name}`);
      console.log(`     [${p.stage}]`);
      console.log();
    });
    console.log("🌐 打开 http://localhost:3000 查看看板\n");
  }
}

main();
