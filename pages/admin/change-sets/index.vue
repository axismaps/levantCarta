<template>
  <div>
    <h2 style="margin-bottom: 20px">Change Sets</h2>
    <hr style="margin-bottom: 25px" />
    <div style="margin-bottom: 25px">
      <p>You’re viewing [Open Change Sets] filtered by [All Time] and [All Users]</p>
    </div>
    <div>
      <el-card class="box-card" shadow="never">
        <div
          style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;"
        >
          <div style="display: flex; align-items: center;">
            <font-awesome-icon :icon="['far', 'user-circle']" />
            <P style="margin-left: 5px">Submitted by [username] on 05/20/2019</P>
          </div>
          <div>
            <el-button class="font-awesome-icon" type="text" circle>
              <font-awesome-icon :icon="['far', 'ellipsis-h']" />
            </el-button>
          </div>
        </div>
        <div>
          <h4 style="margin-bottom: 10px">Edits to roads in the Ain El Mreiseh neighborhood</h4>
          <p
            style="margin-bottom: 10px"
          >Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
          <p style="font-size=7px;">6 changes</p>
        </div>
        <br />
      </el-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
</style>