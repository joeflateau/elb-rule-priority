import { ELBv2 } from "aws-sdk";
import { DescribeRulesOutput } from "aws-sdk/clients/elbv2";

export async function findPriority(listenerArn: string, hostname: string) {
  const rules = await toArray(enumerateRules(listenerArn));

  const existingRule = rules?.find((r) =>
    r.Conditions?.some((condition) =>
      condition.HostHeaderConfig?.Values?.includes(hostname)
    )
  );

  if (existingRule) {
    return existingRule.Priority;
  }

  for (let i = 1; i < 5000; i++) {
    const isInUse = rules?.some((rule) => rule.Priority === String(i));
    if (!isInUse) {
      return i;
    }
  }

  throw new Error("could not find a priority that was not in use");
}

async function toArray<T>(asyncIterator: AsyncGenerator<T[]>) {
  const arr: T[] = [];
  for await (const i of asyncIterator) {
    arr.push(...i);
  }
  return arr;
}

async function* enumerateRules(
  listenerArn: string
): AsyncGenerator<ELBv2.Rule[]> {
  const elbv2 = new ELBv2();
  let nextMarker: string | undefined = undefined;
  do {
    const rulesResponse: DescribeRulesOutput = await elbv2
      .describeRules({
        Marker: nextMarker,
        ListenerArn: listenerArn,
      })
      .promise();

    yield rulesResponse.Rules!;
    nextMarker = rulesResponse.NextMarker;
  } while (nextMarker);
}
