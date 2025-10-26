// deterministic room id for 1:1 chat
function getRoomId(a, b) {
    if (!a || !b) throw new Error('Two user ids required');
    return [a, b].sort().join('_');
  }
  
  module.exports = { getRoomId };
  