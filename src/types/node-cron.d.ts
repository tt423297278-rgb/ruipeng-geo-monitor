declare module "node-cron" {
  export type ScheduledTask = {
    stop(): void;
    start(): void;
  };

  export function schedule(expression: string, task: () => void | Promise<void>): ScheduledTask;

  const cron: {
    schedule: typeof schedule;
  };

  export default cron;
}
