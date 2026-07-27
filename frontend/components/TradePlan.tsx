type Props = {
  plan: any;
};

export default function TradePlan({ plan }: Props) {
  if (!plan) return null;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-xl font-bold mb-4">
        Trade Plan
      </h3>

      <div className="grid grid-cols-2 gap-4">

        <div>
          <p className="text-gray-400">Action</p>
          <p className="font-bold">{plan.action}</p>
        </div>

        <div>
          <p className="text-gray-400">Entry</p>
          <p>{plan.entry}</p>
        </div>

        <div>
          <p className="text-gray-400">Stop Loss</p>
          <p className="text-red-400">{plan.stopLoss}</p>
        </div>

        <div>
          <p className="text-gray-400">Target 1</p>
          <p className="text-green-400">{plan.target1}</p>
        </div>

        <div>
          <p className="text-gray-400">Target 2</p>
          <p className="text-green-400">{plan.target2}</p>
        </div>

        <div>
          <p className="text-gray-400">Risk / Reward</p>
          <p>{plan.riskReward}</p>
        </div>

        <div>
          <p className="text-gray-400">Urgency</p>
          <p>{plan.urgency}</p>
        </div>

      </div>
    </div>
  );
}