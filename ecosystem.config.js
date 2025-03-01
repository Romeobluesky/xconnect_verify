module.exports = {
  apps: [{
    name: 'programs_certify',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_file: '.env'
  }]
};