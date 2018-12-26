import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";
// import { } from 'callback-to-async-iterator';

class EventIterator<T> implements AsyncIterator<T> {
  constructor(emitter: EventEmitter, eventName: String) {

  }

  next(): Promise<IteratorResult<T>> {
    // return Promise.resolve({
    //   done: false,
    //   value: 10
    // });
  }
}

export class FStarProtocolClient {
  private fstarPath: string;

  constructor(fstarPath: string) {
    this.fstarPath = fstarPath;
  }

  connect(filepath: string): { send: (query: string, args: any) => Promise<void>, recieve: () => Promise<Response>, dispose: () => Promise<void>) {
    let process = spawn(this.fstarPath, ["--ide", filepath]);
    let qid = 0;

    let receiver = (() => {
      let messageBuffer: PromiseChain<Response> = null;

      process.stdout.on("data", (chunk: string) => {
        let response: Response = JSON.parse(chunk);
        snoc(messageBuffer, new Promise((resolve, reject) => resolve(response)));
      });

      // return
    })();

    return {
      async send(query, args) {
        process.stdin.emit(JSON.stringify({
          "query-id": qid.toString(),
          query,
          args
        }) + "\n");
        qid++;
      },

      async recieve() {
        return {}
      },

      async dispose() {
        process.stdin.emit(JSON.stringify({
          "query-id": qid,
          query: "exit",
          args: {}
        }) + "\n");
      }
    };
  }

  async autocomplete(args: AutocompleteArgs): Promise<Response> {
    return this.query("autocomplete", args);
  }

  // async 

  dispose() {
    this.process.kill();
  }
}