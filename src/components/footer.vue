<!-- 回到第一版（已恢复原色，无滚动条） -->
<template>
  <footer class="neon-footer">
    <div class="glow-text">
      <span v-for="(c, i) in text" :key="i" :style="{ animationDelay: `${i * 0.05}s` }">
        {{ c }}
      </span>
    </div>

    <div class="social-links">
      <a v-for="icon in icons" :key="icon" href="#" :class="icon" />
    </div>

    <p class="copyright">© 2025 {{ brand }} · All rights reserved.</p>
  </footer>
</template>

<script setup>
const text  = 'POWERED BY VUE3';
const brand = 'SHREK AOG';
const icons = ['fab fa-github', 'fab fa-twitter', 'fab fa-bilibili'];
</script>

<style scoped>
.neon-footer{
  position: relative;
  padding: 50px 0 35px;
  text-align: center;
  background: #0a0a0a;
  color: #fff;
}
.neon-footer::before{
  content:'';
  position:absolute;
  inset:0;
  background: linear-gradient(135deg,#ff0099 0%,#ff7a00 20%,#ffea00 40%,#00ffea 60%,#0080ff 80%,#8400ff 100%);
  background-size: 400% 400%;
  animation: gradient 4s ease infinite;
  opacity: .8;
  z-index:0;
}
.glow-text{
  font: 900 2.2rem 'Orbitron', sans-serif;
  letter-spacing: .12em;
  position: relative;
  z-index:1;
}
.glow-text span{
  display:inline-block;
  animation: pulse 1.2s ease-in-out infinite alternate;
}
.social-links{
  margin: 20px 0;
  z-index:1;
  position: relative;
}
.social-links a{
  display: inline-block;
  font-size: 1.6rem;
  color:#fff;
  margin: 0 15px;
  transition: .3s;
}
.social-links a:hover{
  color:#00ffff;
  transform: scale(1.2);
  filter: drop-shadow(0 0 8px #00ffff);
}
.copyright{ font-size: .9rem; color:#bbb; z-index:1; position:relative; }
@keyframes gradient{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes pulse{
  from{text-shadow:0 0 5px #fff,0 0 10px #fff,0 0 20px #ff00ff,0 0 40px #ff00ff;}
  to  {text-shadow:0 0 10px #fff,0 0 20px #00ffff,0 0 40px #00ffff,0 0 80px #00ffff;}
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">