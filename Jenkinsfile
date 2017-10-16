#!groovy

node {
    stage('checkout') {
        checkout scm
    }
    
	def environment = env.BRANCH_NAME == 'master' ? 'production' : 'staging'
	def repo = "image-registry:5000/node-home-api:${environment}"

    docker.withServer(env.HOME_API_BUILDER_DOCKER_HOST) {
        stage('build') {
            sh "docker build -t ${repo} ."
        }

        stage('push') {
            sh "docker push ${repo}"
        }
    }
	
	stage('deploy') {
		def service_name = env.BRANCH_NAME == 'master' ? 'api' : 'testapi'
		def working_dir = env.HOME_ENV_COMPOSE_DIR
		sh "ssh ${env.HOME_ENV_SSH_USERNAME}@${env.HOME_ENV_IP} 'cd ${working_dir} && docker-compose pull ${service_name}'"
        sh "ssh ${env.HOME_ENV_SSH_USERNAME}@${env.HOME_ENV_IP} 'cd ${working_dir} && docker-compose up -d ${service_name}'"
	}
}
