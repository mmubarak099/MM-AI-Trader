type Props = {
  decision: any;
};

export default function TradeManagerAI({
  decision,
}: Props) {
  if (!decision) return null;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h3 className="text-xl font-bold mb-5">
        🤖 Trade Manager AI
      </h3>

      <div className="space-y-4">

        <div>
          <p className="text-gray-400">
            Recommendation
          </p>

          <p className="text-cyan-400 font-bold text-xl">
            {decision.recommendation}
          </p>
        </div>

        <div>
          <p className="text-gray-400">
            Confidence
          </p>

          <p className="font-bold">
            {decision.confidence}%
          </p>
        </div>

        <div>

          <p className="text-gray-400 mb-2">
            AI Reasons
          </p>

          <ul className="space-y-2">

            {decision.reasons.map(
              (reason: string, index: number) => (

                <li
                  key={index}
                  className="flex gap-2"
                >
                  <span className="text-green-400">
                    ✔
                  </span>

                  <span>
                    {reason}
                  </span>

                </li>

              )
            )}

          </ul>

        </div>

      </div>

    </div>
  );
}