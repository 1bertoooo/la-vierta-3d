import { useGame } from "./store";
import type { Classe } from "./classes";

/**
 * Avalia condições do tipo:
 *  - "flag:nome_da_flag"  → checa state.flags
 *  - "pedaco:coracao"     → checa state.pedacosColetados
 *  - "has:item:X"         → checa inventory (TODO — usa flags por enquanto: "tem_item_X")
 *  - "has:50g"            → checa moedas (TODO — sempre true por enquanto)
 *  - "classe:guerreira"   → checa classe do player local
 *  - "esperanca:5"        → state.esperanca >= 5
 *  - "sina:5"             → state.sina >= 5
 *  - "vierta:10"          → state.vierta >= 10
 */
export function avaliarCondicao(cond: string | undefined, classe?: Classe): boolean {
  if (!cond) return true;
  const state = useGame.getState();
  const [tipo, ...rest] = cond.split(":");
  const arg = rest.join(":");
  switch (tipo) {
    case "flag":
      return !!state.flags[arg];
    case "pedaco":
      return state.pedacosColetados.includes(arg as never);
    case "has":
      // por enquanto, qualquer "has:X" passa (placeholder)
      return true;
    case "classe":
      return classe === arg;
    case "esperanca":
      return state.esperanca >= parseInt(arg);
    case "sina":
      return state.sina >= parseInt(arg);
    case "vierta":
      return state.vierta >= parseInt(arg);
    default:
      return true;
  }
}
