import { InstalledHapp, Player } from "@holochain/tryorama";
import path from "path";

const rolesDna = path.join(__dirname, "../../workdir/dna/roles.dna");

export const installAgents = async (
  conductor: Player,
  agentNames: string[]
) => {
  const admin = conductor.adminWs();
  const dnaHash = await conductor.registerDna(
    { path: rolesDna },
    conductor.scenarioUID
  );
  const agentsHapps: Array<InstalledHapp> = [];
  for (let i = 0; i < agentNames.length; i++) {
    const agent = agentNames[i];
    console.log(`generating key for: ${agent}:`);
    const agent_key = await admin.generateAgentPubKey();
    console.log(`${agent} pubkey:`, agent_key.toString("base64"));

    let dna = {
      hash: dnaHash,
      nick: "roles",
      role_id: "roles",
    };

    const req = {
      agent_key,
      installed_app_id: `${agent}_kizuna`,
      dnas: [dna],
      membrane_proofs: {},
      path: rolesDna,
    };
    console.log(`installing happ for: ${agent}`);
    const agentHapp = await conductor._installBundledHapp(req);
    agentsHapps.push(agentHapp);
  }

  return agentsHapps;
};
