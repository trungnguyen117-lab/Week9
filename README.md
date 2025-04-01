# Week9

### Họ và tên: Nguyễn Trung Nguyên

### Mã số sinh viên: 22024553

### Instal kube-prometheus-stack

![alt text](image.png)

### Run a Prometheus query

#### Table

![alt text](image-1.png)
![alt text](image-2.png)

#### Graph

![alt text](image-3.png)

### Use Grafana dashboards

![alt text](image-4.png)
![alt text](image-5.png)

#### Explore the Grafana pre-built dashboards

Monitoring cluster utilization with “Kubernetes / Compute Resources / Cluster”
![alt text](image-6.png)
Viewing a node’s resource consumption with “Node Exporter / Nodes”

![alt text](image-7.png)
Viewing the resource consumption of individual pods with “Kubernetes / Compute Resources / Pod”

![alt text](image-8.png)

### Configure alerts with Alertmanager

![alt text](image-9.png)
Next run the following command to simulate triggering a basic alert from a Kubernetes service in a specific namespace:

$ curl -H 'Content-Type: application/json' -d '[{"labels":{"alertname":"alert-demo","namespace":"demo","service":"demo"}}]' http://127.0.0.1:9093/api/v1/alerts

#### Final Result

![alt text](image-10.png)
