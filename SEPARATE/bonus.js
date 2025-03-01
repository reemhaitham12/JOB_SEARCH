function canJump(nums) {
  let Reach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > Reach) return false;
    Reach = Math.max(Reach, i + nums[i]);
    if (Reach >= nums.length - 1) return true;
  }

  return false;
}

// Example
console.log(canJump([2, 3, 1, 1, 4])); // true
console.log(canJump([3, 2, 1, 0, 4])); // false
