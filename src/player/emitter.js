// Minimal pub/sub so the player model can talk to any number of views.
export function createEmitter() {
  const topics = new Map();
  return {
    on(topic, fn) {
      if (!topics.has(topic)) topics.set(topic, new Set());
      topics.get(topic).add(fn);
      return () => topics.get(topic).delete(fn);
    },
    emit(topic, payload) {
      topics.get(topic)?.forEach((fn) => fn(payload));
    },
  };
}
