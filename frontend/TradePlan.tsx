type Props = {
  plan: any;
};

export default function TradePlan({
  plan,
}: Props) {

  if (!plan) return null;

  return (

    <div className="bg-gray-900 rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-5">
        📈 AI Trade Plan
      </h2>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span>Action</span>
          <span
            className={
              plan.action === "BUY"
                ? "text-green-400 font-bold"
                : plan.action === "SELL"
                ? "text-red-400 font-bold"
                : "text-yellow-400 font-bold"
            }
          >
            {plan.action}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Entry</span>
          <span>{plan.entry}</span>
        </div>

        <div className="flex justify-between">
          <span>Stop Loss</span>
          <span className="text-red-400">
            {plan.stopLoss}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Target 1</span>
          <span className="text-green-400">
            {plan.target1}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Target 2</span>
          <span className="text-green-400">
            {plan.target2}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Risk : Reward</span>
          <span>{plan.riskReward}</span>
        </div>

        <div className="flex justify-between">
          <span>Urgency</span>

          <span
            className={
              plan.urgency === "HIGH"
                ? "text-red-400 font-bold"
                : plan.urgency === "MEDIUM"
                ? "text-yellow-400 font-bold"
                : "text-green-400 font-bold"
            }
          >
            {plan.urgency}
          </span>

        </div>

      </div>

    </div>

  );

}