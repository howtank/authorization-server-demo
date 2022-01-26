pipeline {
    agent any

    options {
        parallelsAlwaysFailFast()
    }

    parameters {
    //     choice(
    //         name: 'ENVIRONMENT',
    //         choices: ['staging', 'prod'],
    //         description: 'Select ENV'
    //     )
        gitParameter(
            name: 'BRANCH',
            branchFilter: 'origin/(.*)',
            defaultValue: 'main',
            sortMode: 'ASCENDING_SMART',
            type: 'PT_BRANCH',
            selectedValue: 'TOP',
            quickFilterEnabled: true
        )
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH}", credentialsId: "${env.GIT_CREDENTIALS_ID}", url: "${env.GIT_URL}"
            }

        }

        stage('Compile') {
            steps {
                parallel(
                    java: {
                        sh label: "transfer files", script: "rsync -av --delete $WORKSPACE/ /docker-data/docker/authorization-server-demo/"
                    }
                )
            }
        }


        stage ('Deploy') {
            steps {
                script {
                        stage ('Deploy on staging') {
                            sh label: 'Stop container', script: "cd ${DOCKER_CONFIG} && sudo /usr/local/bin/docker-compose stop oauth2"
                            }

                        stage ('Starting container') {
                            sh 'cd ${DOCKER_CONFIG} && sudo /usr/local/bin/docker-compose build oauth2'
                            sh 'cd ${DOCKER_CONFIG} && sudo /usr/local/bin/docker-compose up -d oauth2'
                        }

                }
            }
        }


        stage ('Verify application started') {
            options {
                timeout(time: 300, unit: 'SECONDS')
            }

            steps {
                    waitUntil {
                        script {
                            def APP_HOSTNAME = params.ENVIRONMENT == 'prod' ? 'www.howtank.com' : "oauth.howtank.ninja";

                            def exitCode = sh(returnStatus: true, script: "curl -s --head --request GET  https://oauth.howtank.ninja | grep -o 'HTTP/1.1 200'")
                            return exitCode == 0
                        }
                    }
                }
        }
    }


    post {
        always {
            howtankNotification (
                streamId: 'ccb5e47a4f0311ea909c0a815897bad6ae46634d',
                message: 'Hey @all! ${JOB_NAME} build status from $BRANCH branch to Oauth on ${ENVIRONMENT} is ${BUILD_STATUS}',
                accessToken: 'id:howtank_jenkins_jwt',
                notifyAborted: 'false',
                notifyFailure: 'true',
                notifyNotBuilt: 'false',
                notifySuccess: 'true',
                notifyUnstable: 'false',
                notifyBackToNormal: 'true'
            )
            
        }
    }

}