export interface Env {
	AI: any;
}

export default {
	async fetch(request, env): Promise<Response> {
		const { messages = [] } = (await request.json()) as { messages?: string[] };
		const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });
		return Response.json(response);
	},
} satisfies ExportedHandler<Env>;
